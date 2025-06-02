use std::{
    fs::{self},
    io::{self, SeekFrom},
    path::{Path, PathBuf},
    sync::Arc,
    time::Instant,
};

use async_compression::tokio::bufread::GzipDecoder;
use futures_util::TryStreamExt;

use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::json;

use tauri::{AppHandle, Emitter};
use tokio::{
    fs::File,
    io::{AsyncReadExt, AsyncSeekExt, AsyncWriteExt},
    sync::Mutex,
    task::JoinHandle,
};

use digest::Digest;
use md5::Md5;

use crate::modules::util;

#[derive(Default, Serialize, Debug, Deserialize, Clone)]
pub struct DownloadingStateTauri {
    pub active_downloads: std::collections::HashMap<String, bool>,
}

impl DownloadingStateTauri {
    pub fn new() -> Self {
        Self {
            active_downloads: std::collections::HashMap::new(),
        }
    }

    pub fn add_download(&mut self, manifest_id: String) {
        self.active_downloads.insert(manifest_id, true);
    }

    pub fn remove_download(&mut self, manifest_id: String) {
        self.active_downloads.remove(&manifest_id);
    }

    pub fn is_downloading(&self, manifest_id: &str) -> bool {
        self.active_downloads.contains_key(manifest_id)
    }
}

// thank you to scarand for helping with most of this <3
// this is just a port of the chunker made in golang

#[derive(Serialize, Debug, Deserialize, Clone)]
struct VerifyProgressTauri {
    current_file: String,
    checked_files: usize,
    total_files: usize,
    manifest_id: String,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[allow(non_snake_case)]
struct Chunk {
    Offset: i64,
    Size: i64,
    Hash: String,
}

pub async fn md5_hash_file(path: &str) -> io::Result<String> {
    let mut file = File::open(path).await?;
    let mut hasher = Md5::new();
    let mut buf = [0u8; 8192];

    loop {
        let n = file.read(&mut buf).await?;
        if n == 0 {
            break;
        }
        hasher.update(&buf[..n]);
    }

    Ok(format!("{:X}", hasher.finalize()))
}

#[derive(Debug, Deserialize, Serialize, Clone)]
#[allow(non_snake_case)]
struct FileEntry {
    #[serde(rename = "Path")]
    pub DisplayPath: String,
    Size: i64,
    Chunks: Option<Vec<Chunk>>,
    Hash: Option<String>,
}

impl FileEntry {
    fn get_filename(&self) -> String {
        let sanitized_path = FileEntry::beautify_display_path(self.DisplayPath.clone());
        let path = Path::new(&sanitized_path);

        match path.file_name() {
            Some(filename) => filename.to_string_lossy().to_string(),
            None => "undefined".to_string(),
        }
    }

    async fn created(&self, download_path: &str) -> bool {
        let sanitized_path = FileEntry::beautify_display_path(self.DisplayPath.clone());

        let file_path = PathBuf::from(sanitized_path);
        let full_path = Path::new(download_path).join(&file_path);

        if !self.Hash.is_none() {
            let disk_hash = md5_hash_file(full_path.to_str().unwrap()).await;
            match disk_hash {
                Ok(hash) => {
                    if hash.to_lowercase() != self.Hash.as_ref().unwrap().to_lowercase() {
                        return false;
                    }
                }
                Err(err) => {
                    dbg!(println!("Error calculating hash: {}", err));
                    return false;
                }
            }
        }

        match fs::metadata(&full_path) {
            Ok(m) => {
                let file_length = m.len();
                file_length == self.Size as u64
            }
            Err(err) => {
                if err.kind() == io::ErrorKind::NotFound {
                    return false;
                } else {
                    return true;
                }
            }
        }
    }

    fn beautify_display_path(path: String) -> String {
        let sanitized_path = path
            .clone()
            .replace('\\', "/")
            .strip_prefix('/')
            .unwrap_or(&path)
            .to_string();

        return sanitized_path;
    }
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[allow(non_snake_case)]
struct Manifest {
    ID: String,
    UploadName: String,
    Files: Vec<FileEntry>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ManifestProgress {
    downloaded_bytes: u64,
    total_bytes: u64,
    percent: f64,
    speed_mbps: f64,
    eta_seconds: u64,
    manifest_id: String,
    current_files: Vec<String>,
    wants_cancel: bool,
}

const BASE_URL: &str = "https://cdn.retrac.site/manifest";
const TMP_FOLDER: &str = "TemporaryChunks";

async fn filter_missing_files_with_progress(
    manifest: &mut Manifest,
    download_path: &str,
    app_handle: &AppHandle,
) {
    let total = manifest.Files.len();
    let mut checked = 0;
    let mut filtered_files = Vec::new();

    for file in &manifest.Files {
        checked += 1;

        let file_name = file.get_filename();
        let _ = app_handle.emit(
            "VERIFY_PROGRESS",
            VerifyProgressTauri {
                current_file: file_name,
                checked_files: checked,
                total_files: total,
                manifest_id: manifest.UploadName.clone(),
            },
        );

        if !file.created(download_path).await {
            filtered_files.push(file.clone());
        }
    }

    manifest.Files = filtered_files;
}

async fn rebuild_file(
    chunk_info: Vec<(PathBuf, u64)>,
    output_path: &Path,
) -> Result<(), Box<dyn std::error::Error>> {
    if let Some(parent) = output_path.parent() {
        tokio::fs::create_dir_all(parent).await?;
    }

    let mut output_file = tokio::fs::OpenOptions::new()
        .create(true)
        .write(true)
        .open(output_path)
        .await?;

    for (chunk_path, offset) in chunk_info {
        let chunk_data = tokio::fs::read(&chunk_path).await?;

        output_file.seek(SeekFrom::Start(offset)).await?;
        output_file.write_all(&chunk_data).await?;

        if let Err(e) = tokio::fs::remove_file(&chunk_path).await {
            dbg!(eprintln!(
                "Warning: Failed to delete chunk {}: {}",
                chunk_path.display(),
                e
            ));
        }
    }

    output_file.flush().await?;
    Ok(())
}

async fn download_manifest(manifest_name: &str, client: &Client) -> Result<Manifest, bool> {
    let manifest_url = format!(
        "{}/{}",
        BASE_URL,
        format!("{}.acidmanifest", manifest_name).as_str()
    );

    let response = client.get(&manifest_url).send().await.unwrap();
    if !response.status().is_success() {
        dbg!(println!("Failed to download manifest: {}", manifest_url));
        return Err(false);
    }

    let manifest_bytes = response.bytes().await.unwrap();
    let manifest_json = serde_json::from_slice(&manifest_bytes);

    match manifest_json {
        Ok(json) => Ok(json),
        Err(err) => {
            dbg!(println!("Failed to parse manifest: {}", err));
            Err(false)
        }
    }
}

async fn download_build_chunk(
    client: &Client,
    download_url: String,
    chunk: &Chunk,
    temp_chunk_path: PathBuf,
    progress: Arc<Mutex<ManifestProgress>>,
    start_time: Instant,
) -> Result<(), Box<dyn std::error::Error>> {
    let response = client.get(download_url).send().await?;
    if !response.status().is_success() {
        return Err(format!("Failed to download chunk {}", chunk.Hash).into());
    }

    if let Some(parent) = temp_chunk_path.parent() {
        tokio::fs::create_dir_all(parent).await?;
    }

    let stream = response
        .bytes_stream()
        .map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, e));
    let stream_reader = tokio_util::io::StreamReader::new(stream);

    let mut decoder = GzipDecoder::new(stream_reader);
    let mut file = File::create(&temp_chunk_path).await?;

    let mut buffer = [0u8; 8192];

    loop {
        if progress.lock().await.wants_cancel {
            return Err("Download cancelled".into());
        }

        let n = decoder.read(&mut buffer).await?;
        if n == 0 {
            break;
        }

        file.write_all(&buffer[..n]).await?;

        {
            let mut progress = progress.lock().await;
            progress.downloaded_bytes += n as u64;
            progress.percent =
                (progress.downloaded_bytes as f64 / progress.total_bytes as f64) * 100.0;
            let elapsed = start_time.elapsed().as_secs_f64();
            if elapsed > 0.0 {
                let mbps = (progress.downloaded_bytes as f64 / 1024.0 / 1024.0) / elapsed;
                progress.speed_mbps = mbps;
                let remaining = progress
                    .total_bytes
                    .saturating_sub(progress.downloaded_bytes);
                progress.eta_seconds = (remaining as f64 / 1024.0 / 1024.0 / mbps).ceil() as u64;
            }
        }
    }

    file.flush().await?;

    Ok(())
}

async fn download_file(
    client: &Client,
    file: &FileEntry,
    manifest_id: &str,
    download_path: &Arc<String>,
    progress: Arc<Mutex<ManifestProgress>>,
    start_time: Instant,
) -> Result<(), Box<dyn std::error::Error>> {
    {
        let mut progress = progress.lock().await;
        progress.current_files.push(file.get_filename().clone());
    }

    let mut chunk_info: Vec<(PathBuf, u64)> = vec![];
    let sanitized_path = FileEntry::beautify_display_path(file.DisplayPath.clone());

    let file_path = Path::new(&download_path.to_string()).join(&sanitized_path);
    if file_path.exists() {
        if let Err(e) = tokio::fs::remove_file(&file_path).await {
            dbg!(eprintln!(
                "Warning: Failed to delete file {}: {}",
                file_path.display(),
                e
            ));
        }
    }

    dbg!(println!(
        "Downloading: {}",
        Path::new(&download_path.to_string())
            .join(&sanitized_path)
            .display()
    ));

    for chunk in file.Chunks.clone().unwrap_or(vec![]) {
        if progress.lock().await.wants_cancel {
            return Err("Download cancelled".into());
        }

        let tmp_chunk_path = Path::new(&download_path.to_string())
            .join(TMP_FOLDER)
            .join(sanitized_path.clone())
            .join(format!("{}", chunk.Hash));

        let chunk_url = format!("{}/{}/{}", BASE_URL, manifest_id, chunk.Hash);

        if let Err(errror_chunk_download) = download_build_chunk(
            client,
            chunk_url,
            &chunk,
            tmp_chunk_path.clone(),
            progress.clone(),
            start_time,
        )
        .await
        {
            return Err(errror_chunk_download);
        }

        chunk_info.push((tmp_chunk_path.clone(), chunk.Offset as u64));
    }

    let final_save_path = Path::new(&download_path.to_string()).join(sanitized_path);

    if let Err(e) = rebuild_file(chunk_info, &final_save_path).await {
        dbg!(println!("Error rebuilding file: {}", e));
        return Err(e);
    }

    // rebuild_file(chunk_info, &final_save_path).await.unwrap();

    {
        let mut progress = progress.lock().await;
        progress.current_files.retain(|f| f != &file.get_filename());
    }

    Ok(())
}

pub async fn download_build_internal(
    manifest_id: &str,
    download_path: &str,
    handle: AppHandle,
) -> Result<bool, String> {
    let client = Client::new();

    match download_manifest(manifest_id, &client).await {
        Ok(mut manifest) => {
            let _ = handle.emit(
                "VERIFYING",
                json!({ "manifest_id": manifest_id, "status": true }),
            );
            filter_missing_files_with_progress(&mut manifest, download_path, &handle).await;
            let _ = handle.emit(
                "VERIFYING",
                json!({ "manifest_id": manifest_id, "status": false }),
            );

            if manifest.Files.len() == 0 {
                let _ = handle.emit("BUILD_ALREADY_INSTALLED", json!({ "manifest_id": manifest_id, "message": "Build is already fully installed" }));
                return Ok(true);
            }

            {
                let state = util::get_downloading_state().await;
                if state.is_downloading(manifest_id) {
                    dbg!(println!("Another download is already in progress"));
                    return Err("Another download is already in progress".to_string());
                }
            }

            let total_ungziped_size = manifest
                .Files
                .iter()
                .flat_map(|f| f.Chunks.as_deref().unwrap_or(&[]))
                .map(|c| c.Size)
                .sum::<i64>();

            let thread_amount = num_cpus::get() / 2;
            // let thread_amount = 1; // more accurate when 1 thread

            let semaphore: Arc<tokio::sync::Semaphore> =
                Arc::new(tokio::sync::Semaphore::new(thread_amount));
            let mut handles: Vec<JoinHandle<Result<(), String>>> = vec![];
            let download_path_arc = Arc::new(download_path.to_string());

            let progress = Arc::new(Mutex::new(ManifestProgress {
                downloaded_bytes: 0,
                total_bytes: total_ungziped_size as u64,
                percent: 0.0,
                speed_mbps: 0.0,
                eta_seconds: 0,
                manifest_id: manifest_id.to_string(),
                wants_cancel: false,
                current_files: vec![],
            }));

            let start_time = Instant::now();

            let progress_clone = progress.clone();
            let handle_clone = handle.clone();

            if manifest.Files.len() > 0 {
                dbg!(println!("Starting download progress timer"));

                {
                    // let state = handle.state::<Mutex<DownloadingStateTauri>>();
                    // let mut state = state.lock().await;
                    // state.active_downloads.insert(manifest_id.to_string(), true);

                    let mut state = util::get_downloading_state().await;
                    state.add_download(manifest_id.to_string());
                    util::set_downloading_state(state).await;
                }

                tokio::spawn(async move {
                    let mut interval = tokio::time::interval(std::time::Duration::from_millis(100));
                    loop {
                        interval.tick().await;

                        let progress = progress_clone.lock().await;
                        if let Err(e) = handle_clone.emit("DOWNLOAD_PROGRESS", &*progress) {
                            dbg!(eprintln!("Failed to emit progress: {}", e));
                        }

                        if progress.percent >= 100.0 || progress.wants_cancel {
                            break;
                        }
                    }
                });
            }

            for file in manifest.Files {
                let permit = semaphore.clone().acquire_owned().await.unwrap();
                let client = client.clone();
                let download_path_arc = download_path_arc.clone();
                let manifest_id = manifest.ID.clone();
                let progress = progress.clone();
                let start_time = start_time.clone();

                let progress = progress.clone();
                let thread_handle = tokio::spawn(async move {
                    let _ = download_file(
                        &client,
                        &file,
                        &manifest_id,
                        &download_path_arc,
                        progress.clone(),
                        start_time,
                    )
                    .await;

                    drop(permit);
                    Ok(())
                });

                handles.push(thread_handle);
            }

            for thread_handle in handles {
                if let Err(e) = thread_handle.await.unwrap() {
                    dbg!(println!("Error in download handle: {}", e));

                    {
                        let mut state = util::get_downloading_state().await;
                        state.remove_download(manifest_id.to_string());
                        util::set_downloading_state(state).await;
                    }

                    return Err(format!(
                        "Failed to download file: {}",
                        e.to_string()
                    ));

                }
            }

            {
                let mut state = util::get_downloading_state().await;
                state.remove_download(manifest_id.to_string());
                util::set_downloading_state(state).await;
            }

            let tmp_path = Path::new(download_path).join(TMP_FOLDER);
            if let Err(e) = tokio::fs::remove_dir_all(tmp_path).await {
                dbg!(eprintln!("Warning: Failed to delete tmp folder {}", e));
            };

            return Ok(true);
        }
        Err(_) => {
            dbg!(println!("Failed to download the manifest"));
            return Err("Failed to download manifest".to_string());
        }
    }
}

pub async fn download_build(manifest_id: &str, download_path: &str) -> Result<bool, String> {
    download_build_internal(manifest_id, download_path, util::get_app_handle()).await
}
