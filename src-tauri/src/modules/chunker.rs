use std::{
    collections::VecDeque,
    fs::{self}, io::{self, SeekFrom}, path::{Path, PathBuf}, sync::Arc, thread, time::Instant
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
    pub cancel_requests: std::collections::HashMap<String, bool>,
    pub pause_requests: std::collections::HashMap<String, bool>,
}

impl DownloadingStateTauri {
    pub fn new() -> Self {
        Self {
            active_downloads: std::collections::HashMap::new(),
            cancel_requests: std::collections::HashMap::new(),
            pause_requests: std::collections::HashMap::new(),
        }
    }

    pub fn add_download(&mut self, manifest_id: String) {
        println!("Adding download for manifest: {}", manifest_id);
        self.active_downloads.insert(manifest_id, true);
    }

    pub fn remove_download(&mut self, manifest_id: String) {
        self.active_downloads.remove(&manifest_id);
    }

    pub fn is_downloading(&self, manifest_id: &str) -> bool {
        self.active_downloads.contains_key(manifest_id)
    }

    pub fn request_cancel(&mut self, manifest_id: String) {
        self.cancel_requests.insert(manifest_id, true);
    }

    pub fn is_cancel_requested(&self, manifest_id: &str) -> bool {
        self.cancel_requests.contains_key(manifest_id)
    }

    pub fn clear_cancel_requests(&mut self) {
        self.cancel_requests.clear();
    }

    pub fn request_pause(&mut self, manifest_id: String) {
        self.pause_requests.insert(manifest_id, true);
    }

    pub fn is_pause_requested(&self, manifest_id: &str) -> bool {
        self.pause_requests.contains_key(manifest_id)
    }

    pub fn clear_pause_request(&mut self, manifest_id: &str) {
        self.pause_requests.remove(manifest_id);
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
    is_paused: bool,
    #[serde(skip)]
    bytes_history: VecDeque<(Instant, u64)>,
}

const BASE_URL: &str = "https://cdn.atmos.chat/manifest";
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

        thread::sleep(
            std::time::Duration::from_millis(1)
        );

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
) -> Result<(), String> {
    if let Some(parent) = output_path.parent() {
        tokio::fs::create_dir_all(parent).await.map_err(|e| e.to_string())?;
    }

    let mut output_file = tokio::fs::OpenOptions::new()
        .create(true)
        .write(true)
        .open(output_path)
        .await
        .map_err(|e| e.to_string())?;

    for (chunk_path, offset) in chunk_info {
        let chunk_data = tokio::fs::read(&chunk_path).await.map_err(|e| e.to_string())?;

        output_file.seek(SeekFrom::Start(offset)).await.map_err(|e| e.to_string())?;
        output_file.write_all(&chunk_data).await.map_err(|e| e.to_string())?;

        if let Err(e) = tokio::fs::remove_file(&chunk_path).await {
            dbg!(eprintln!(
                "Warning: Failed to delete chunk {}: {}",
                chunk_path.display(),
                e
            ));
        }
    }

    output_file.flush().await.map_err(|e| e.to_string())?;
    Ok(())
}

async fn download_manifest(manifest_name: &str, client: &Client) -> Result<Manifest, bool> {
    let manifest_url = format!(
        "{}/{}",
        BASE_URL,
        format!("{}.acidmanifest#", manifest_name).as_str()
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
    _start_time: Instant, // Kept for API consistency, may be used for timing in future
) -> Result<(), String> {
    let part_file_path = temp_chunk_path.with_extension("part");
    let manifest_id = progress.lock().await.manifest_id.clone();
    
    // Check if .part file exists (resume scenario) - this contains decompressed data
    let mut resume_from_part = false;
    if part_file_path.exists() {
        // Check if the part file is complete (same size as expected chunk)
        if let Ok(metadata) = tokio::fs::metadata(&part_file_path).await {
            if metadata.len() == chunk.Size as u64 {
                // Part file is complete, just rename it
                if temp_chunk_path.exists() {
                    let _ = tokio::fs::remove_file(&temp_chunk_path).await;
                }
                tokio::fs::rename(&part_file_path, &temp_chunk_path).await.map_err(|e| e.to_string())?;
                return Ok(());
            } else if metadata.len() > 0 {
                // Part file exists but incomplete - we'll resume from it
                resume_from_part = true;
                dbg!(println!("Resuming chunk {} from {} bytes", chunk.Hash, metadata.len()));
            }
        }
    }

    // Build HTTP request
    let response = client.get(&download_url).send().await.map_err(|e| e.to_string())?;
    if !response.status().is_success() {
        return Err(format!("Failed to download chunk {}", chunk.Hash));
    }

    if let Some(parent) = temp_chunk_path.parent() {
        tokio::fs::create_dir_all(parent).await.map_err(|e| e.to_string())?;
    }

    let stream = response
        .bytes_stream()
        .map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, e));
    let stream_reader = tokio_util::io::StreamReader::new(stream);

    let mut decoder = GzipDecoder::new(stream_reader);
    
    // Open file - append if resuming from part, otherwise create new
    let mut file = if resume_from_part {
        // Copy part file to main chunk path and open in append mode
        let part_data = tokio::fs::read(&part_file_path).await.map_err(|e| e.to_string())?;
        if temp_chunk_path.exists() {
            let _ = tokio::fs::remove_file(&temp_chunk_path).await;
        }
        let mut new_file = File::create(&temp_chunk_path).await.map_err(|e| e.to_string())?;
        new_file.write_all(&part_data).await.map_err(|e| e.to_string())?;
        new_file.flush().await.map_err(|e| e.to_string())?;
        tokio::fs::OpenOptions::new()
            .create(true)
            .append(true)
            .open(&temp_chunk_path)
            .await
            .map_err(|e| e.to_string())?
    } else {
        File::create(&temp_chunk_path).await.map_err(|e| e.to_string())?
    };

    let mut buffer = [0u8; 8192];

    loop {
        let state = util::get_downloading_state().await;
        if state.is_cancel_requested(&manifest_id) {
            dbg!(println!("Download cancelled for manifest: {}", manifest_id));
            // Save current state to .part file before cancelling
            if let Ok(metadata) = tokio::fs::metadata(&temp_chunk_path).await {
                if metadata.len() > 0 {
                    let file_data = tokio::fs::read(&temp_chunk_path).await.map_err(|e| e.to_string())?;
                    let mut part_file = File::create(&part_file_path).await.map_err(|e| e.to_string())?;
                    part_file.write_all(&file_data).await.map_err(|e| e.to_string())?;
                    part_file.flush().await.map_err(|e| e.to_string())?;
                }
            }
            return Err("Download cancelled by user.".to_string());
        }

        if state.is_pause_requested(&manifest_id) {
            // Save current partial data to .part file
            dbg!(println!("Pausing chunk {} - saving partial data", chunk.Hash));
            
            // Flush current file state
            file.flush().await.map_err(|e| e.to_string())?;
            
            // Copy current file to part file
            if let Ok(metadata) = tokio::fs::metadata(&temp_chunk_path).await {
                if metadata.len() > 0 {
                    let file_data = tokio::fs::read(&temp_chunk_path).await.map_err(|e| e.to_string())?;
                    let mut part_file = File::create(&part_file_path).await.map_err(|e| e.to_string())?;
                    part_file.write_all(&file_data).await.map_err(|e| e.to_string())?;
                    part_file.flush().await.map_err(|e| e.to_string())?;
                }
            }
            
            return Err("Download paused".to_string());
        }

        if progress.lock().await.wants_cancel {
            return Err("Download cancelled".to_string());
        }

        let n = decoder.read(&mut buffer).await.map_err(|e| e.to_string())?;
        if n == 0 {
            break;
        }

        file.write_all(&buffer[..n]).await.map_err(|e| e.to_string())?;

        {
            let mut progress = progress.lock().await;
            progress.downloaded_bytes += n as u64;
            progress.percent =
                (progress.downloaded_bytes as f64 / progress.total_bytes as f64) * 100.0;
            
            let now = Instant::now();
            let current_bytes = progress.downloaded_bytes;
            progress.bytes_history.push_back((now, current_bytes));
            
            let five_seconds_ago = now - std::time::Duration::from_secs(5);
            while let Some(&(timestamp, _)) = progress.bytes_history.front() {
                if timestamp < five_seconds_ago {
                    progress.bytes_history.pop_front();
                } else {
                    break;
                }
            }
        }
    }

    file.flush().await.map_err(|e| e.to_string())?;

    // Delete .part file if it exists after successful completion
    if part_file_path.exists() {
        let _ = tokio::fs::remove_file(&part_file_path).await;
    }

    Ok(())
}

async fn download_file(
    client: &Client,
    file: &FileEntry,
    manifest_id: &str,
    download_path: &Arc<String>,
    progress: Arc<Mutex<ManifestProgress>>,
    start_time: Instant,
    // handle: &AppHandle,
) -> Result<(), String> {
    let file_name = file.get_filename().clone();

    {
        let mut progress = progress.lock().await;
        progress.current_files.push(file_name.clone());
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
        let state = util::get_downloading_state().await;
        if state.is_cancel_requested(manifest_id) {
            dbg!(println!("Download cancelled for manifest: {}", manifest_id));
            {
                let mut progress = progress.lock().await;
                progress.current_files.retain(|f| f != &file_name);
            }
            return Err("Download cancelled by user.".to_string());
        }

        if progress.lock().await.wants_cancel {
            {
                let mut progress = progress.lock().await;
                progress.current_files.retain(|f| f != &file_name);
            }
            return Err("Download cancelled".to_string());
        }

        let tmp_chunk_path = Path::new(&download_path.to_string())
            .join(TMP_FOLDER)
            .join(sanitized_path.clone())
            .join(format!("{}", chunk.Hash));

        // Check if chunk already exists and is complete
        if tmp_chunk_path.exists() {
            if let Ok(metadata) = tokio::fs::metadata(&tmp_chunk_path).await {
                if metadata.len() == chunk.Size as u64 {
                    // Chunk is already complete, skip download
                    chunk_info.push((tmp_chunk_path.clone(), chunk.Offset as u64));
                    continue;
                }
            }
        }

        let chunk_url = format!("{}/{}/{}", BASE_URL, manifest_id, chunk.Hash);

        let chunk_result = download_build_chunk(
            client,
            chunk_url,
            &chunk,
            tmp_chunk_path.clone(),
            progress.clone(),
            start_time,
        )
        .await;

        if let Err(errror_chunk_download) = chunk_result {
            let error_msg = errror_chunk_download.to_string();
            
            // If paused, don't treat as error - just return to allow resume
            if error_msg == "Download paused" {
                {
                    let mut progress = progress.lock().await;
                    progress.current_files.retain(|f| f != &file_name);
                }
                return Err(error_msg);
            }
            
            {
                let mut progress = progress.lock().await;
                progress.current_files.retain(|f| f != &file_name);
            }
            return Err(error_msg);
        }

        chunk_info.push((tmp_chunk_path.clone(), chunk.Offset as u64));

        let state = util::get_downloading_state().await;
        if state.is_cancel_requested(manifest_id) {
            dbg!(println!("Download cancelled for manifest: {}", manifest_id));
            {
                let mut progress = progress.lock().await;
                progress.current_files.retain(|f| f != &file_name);
            }
            return Err("Download cancelled by user.".to_string());
        }
    }

    let final_save_path = Path::new(&download_path.to_string()).join(sanitized_path);

    tokio::time::sleep(std::time::Duration::from_secs(3)).await;

        if let Err(e) = rebuild_file(chunk_info, &final_save_path).await {
        dbg!(println!("Error rebuilding file: {}", e));

        {
            let mut progress = progress.lock().await;
            progress.current_files.retain(|f| f != &file_name);
        }

        // let _ = handle.emit(
        //     "DOWNLOAD_ERROR",
        //     e.to_string(),
        // );

        return Err(e.to_string());
    }

    // rebuild_file(chunk_info, &final_save_path).await.unwrap();

    {
        let mut progress = progress.lock().await;
        progress.current_files.retain(|f| f != &file_name);
    }

    Ok(())
}

pub async fn download_build_internal(
    manifest_id: &str,
    download_path: &str,
    handle: AppHandle,
) -> Result<bool, String> {
    let client = Client::new();

    let mut state = util::get_downloading_state().await;
    if state.is_cancel_requested(manifest_id) && !state.is_downloading(manifest_id) {
        state.clear_cancel_requests();
        util::set_downloading_state(state).await;
    }

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
                is_paused: false,
                current_files: vec![],
                bytes_history: VecDeque::new(),
            }));

            let start_time = Instant::now();

            let progress_clone = progress.clone();
            let handle_clone = handle.clone();

            let mut progress_timer_handle: Option<JoinHandle<()>> = None;

            if manifest.Files.len() > 0 {
                dbg!(println!("Starting download progress timer"));

                {
                    let mut state = util::get_downloading_state().await;
                    state.add_download(manifest_id.to_string());
                    util::set_downloading_state(state).await;
                }

                progress_timer_handle = Some(tokio::spawn(async move {
                    let mut interval = tokio::time::interval(std::time::Duration::from_millis(100));
                    loop {
                        interval.tick().await;

                        let mut progress = progress_clone.lock().await;
                        let now = Instant::now();
                        let current_bytes = progress.downloaded_bytes;
                        
                        let five_seconds_ago = now - std::time::Duration::from_secs(5);
                        while let Some(&(timestamp, _)) = progress.bytes_history.front() {
                            if timestamp < five_seconds_ago {
                                progress.bytes_history.pop_front();
                            } else {
                                break;
                            }
                        }
                        
                        let mbps = if let Some(&(oldest_timestamp, oldest_bytes)) = progress.bytes_history.front() {
                            let time_diff = (now - oldest_timestamp).as_secs_f64();
                            if time_diff >= 5.0 {
                                let bytes_diff = current_bytes.saturating_sub(oldest_bytes);
                                (bytes_diff as f64 / 1024.0 / 1024.0) / 5.0
                            } else if time_diff > 0.0 {
                                let bytes_diff = current_bytes.saturating_sub(oldest_bytes);
                                (bytes_diff as f64 / 1024.0 / 1024.0) / time_diff
                            } else {
                                0.0
                            }
                        } else {
                            0.0
                        };
                        
                        progress.speed_mbps = mbps;
                        if mbps > 0.0 {
                            let remaining = progress
                                .total_bytes
                                .saturating_sub(current_bytes);
                            progress.eta_seconds = (remaining as f64 / 1024.0 / 1024.0 / mbps).ceil() as u64;
                        }
                        
                        if let Err(e) = handle_clone.emit("DOWNLOAD_PROGRESS", &*progress) {
                            dbg!(eprintln!("Failed to emit progress: {}", e));
                        }

                        if progress.percent >= 100.0 || progress.wants_cancel {
                            break;
                        }

                        let state = util::get_downloading_state().await;
                        if state.is_cancel_requested(&progress.manifest_id) {
                            dbg!(println!("Download cancelled for manifest: {}", progress.manifest_id));
                            let mut state = util::get_downloading_state().await;
                            state.request_cancel(progress.manifest_id.clone());
                            util::set_downloading_state(state).await;
                            break;
                        }

                        // Check for pause requests
                        if state.is_pause_requested(&progress.manifest_id) {
                            progress.is_paused = true;
                        } else {
                            progress.is_paused = false;
                        }
                    }
                }));
            }

            for file in manifest.Files {
                let permit = semaphore.clone().acquire_owned().await.unwrap();
                let client = client.clone();
                let download_path_arc = download_path_arc.clone();
                let manifest_id = manifest.ID.clone();
                let progress = progress.clone();
                let start_time = start_time.clone();
                // let handle = handle.clone();

                let progress = progress.clone();
                let thread_handle = tokio::spawn(async move {
                    let result = download_file(
                        &client,
                        &file,
                        &manifest_id,
                        &download_path_arc,
                        progress.clone(),
                        start_time,
                        // &handle,
                    )
                    .await;

                    drop(permit);

                    if let Err(e) = result {
                        if e.to_string() == "Download cancelled by user." {
                            return Err("".to_string());
                        }

                        // If paused, wait for resume instead of treating as error
                        if e.to_string() == "Download paused" {
                            // Wait in a loop until resume or cancel
                            loop {
                                tokio::time::sleep(std::time::Duration::from_millis(100)).await;
                                let state = util::get_downloading_state().await;
                                if state.is_cancel_requested(&manifest_id) {
                                    return Err("".to_string());
                                }
                                if !state.is_pause_requested(&manifest_id) {
                                    // Resume - retry the download
                                    break;
                                }
                            }
                            // Retry the download after resume
                            let retry_result = download_file(
                                &client,
                                &file,
                                &manifest_id,
                                &download_path_arc,
                                progress.clone(),
                                start_time,
                            )
                            .await;
                            
                            if let Err(retry_err) = retry_result {
                                if retry_err.to_string() == "Download cancelled by user." {
                                    return Err("".to_string());
                                }
                                dbg!(println!("Error downloading file after resume: {}", retry_err));
                                return Err(retry_err);
                            }
                            // Success after resume - file is downloaded, return Ok
                            return Ok(());
                        }

                        dbg!(println!("Error downloading file: {}", e));
                        return Err(e.to_string());
                    }

                    Ok(())
                });

                handles.push(thread_handle);
            }

            // Wait for all handles to complete
            let mut results = Vec::new();
            for handle in handles {
                results.push(handle.await);
            }
            
            let mut has_pause = false;
            let mut has_error = false;
            let mut error_msg = String::new();

            for result in results {
                match result {
                    Ok(Ok(_)) => {
                        // Success, continue
                    }
                    Ok(Err(e)) => {
                        if e == "Download paused" {
                            has_pause = true;
                        } else if e == "" {
                            // Cancelled
                            has_error = true;
                            error_msg = "".to_string();
                        } else {
                            has_error = true;
                            error_msg = e;
                        }
                    }
                    Err(e) => {
                        dbg!(println!("Thread join error: {:?}", e));
                        has_error = true;
                        error_msg = "Thread error".to_string();
                    }
                }
            }

            // If paused, wait for resume
            if has_pause && !has_error {
                dbg!(println!("Download paused, waiting for resume..."));
                loop {
                    tokio::time::sleep(std::time::Duration::from_millis(500)).await;
                    let state = util::get_downloading_state().await;
                    if state.is_cancel_requested(manifest_id) {
                        has_error = true;
                        error_msg = "".to_string();
                        break;
                    }
                    if !state.is_pause_requested(manifest_id) {
                        // Resumed - we need to restart the download
                        // Instead of recursion, we'll break and let the outer function handle it
                        dbg!(println!("Download resumed, will continue on next iteration..."));
                        // Clear the pause flag and continue - the download threads will retry
                        // We'll break out and the download will continue naturally
                        break;
                    }
                }
            }

            if has_error {
                if let Some(handle) = progress_timer_handle {
                    handle.abort();
                }

                {
                    let mut state = util::get_downloading_state().await;
                    state.remove_download(manifest_id.to_string());
                    util::set_downloading_state(state).await;
                }

                // Clean up .part files on error/cancel
                let tmp_path = Path::new(download_path).join(TMP_FOLDER);
                if tmp_path.exists() {
                    if let Ok(mut entries) = tokio::fs::read_dir(&tmp_path).await {
                        while let Ok(Some(entry)) = entries.next_entry().await {
                            let path = entry.path();
                            if path.is_file() && path.extension().and_then(|s| s.to_str()) == Some("part") {
                                let _ = tokio::fs::remove_file(&path).await;
                            } else if path.is_dir() {
                                // Recursively clean up .part files in subdirectories
                                if let Ok(mut sub_entries) = tokio::fs::read_dir(&path).await {
                                    while let Ok(Some(sub_entry)) = sub_entries.next_entry().await {
                                        let sub_path = sub_entry.path();
                                        if sub_path.is_file() && sub_path.extension().and_then(|s| s.to_str()) == Some("part") {
                                            let _ = tokio::fs::remove_file(&sub_path).await;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if error_msg != "" {
                    let _ = handle.emit(
                        "DOWNLOAD_ERROR2",
                        json!({ "manifest_id": manifest_id, "error": error_msg }),
                    );
                    return Err(format!(
                        "{} Please contact the support team.",
                        error_msg
                    ));
                } else {
                    dbg!(println!("Download cancelled by user."));
                    return Ok(false);
                }
            }

            if let Some(handle) = progress_timer_handle {
                {
                    let mut progress = progress.lock().await;
                    progress.wants_cancel = true;
                }
                tokio::time::sleep(std::time::Duration::from_millis(150)).await;
                handle.abort();
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

pub async fn delete_build_internal(
    manifest_id: &str,
    download_path: &str,
    handle: AppHandle,
) -> Result<bool, String> {
    let client = Client::new();

    let manifest = match download_manifest(manifest_id, &client).await {
        Ok(m) => m,
        Err(_) => return Err("Failed to fetch manifest for deletion".to_string()),
    };

    let mut failed_deletes = vec![];

    for file in &manifest.Files {
        let sanitized_path = FileEntry::beautify_display_path(file.DisplayPath.clone());
        let full_path = Path::new(download_path).join(&sanitized_path);

        if full_path.exists() {
            if let Err(e) = tokio::fs::remove_file(&full_path).await {
                dbg!(eprintln!("Failed to delete file {}: {}", full_path.display(), e));
                failed_deletes.push(full_path.display().to_string());
            }
        }

        if let Some(parent) = full_path.parent() {
            if let Ok(mut entries) = tokio::fs::read_dir(parent).await {
                if entries.next_entry().await.unwrap_or(None).is_none() {
                    let _ = tokio::fs::remove_dir(parent).await;
                }
            }
        }
    }

    let tmp_path = Path::new(download_path).join(TMP_FOLDER);
    if tmp_path.exists() {
        if let Err(e) = tokio::fs::remove_dir_all(&tmp_path).await {
            dbg!(eprintln!("Warning: Failed to delete tmp folder {}: {}", tmp_path.display(), e));
        }
    }

    let _ = handle.emit(
        "BUILD_DELETED",
        json!({ "manifest_id": manifest_id, "failed": failed_deletes }),
    );

    Ok(true)
}

pub async fn delete_build(manifest_id: &str, download_path: &str) -> Result<bool, String> {
    delete_build_internal(manifest_id, download_path, util::get_app_handle()).await
}

pub async fn cancel_download(manifest_id: &str) -> Result<(), String> {
    let state = util::get_downloading_state().await;
    if !state.is_downloading(manifest_id) {
        return Err("No download in progress for this manifest".to_string());
    }

    let mut state = util::get_downloading_state().await;
    state.request_cancel(manifest_id.to_string());
    util::set_downloading_state(state).await;

    // Clean up .part files for this manifest
    // Note: We need the download_path to clean up, but we don't have it here
    // The cleanup will happen in download_build_internal when it detects cancellation
    // For now, we'll rely on the download process to clean up

    Ok(())
}

pub async fn pause_download(manifest_id: &str) -> Result<(), String> {
    let state = util::get_downloading_state().await;
    if !state.is_downloading(manifest_id) {
        return Err("No download in progress for this manifest".to_string());
    }

    let mut state = util::get_downloading_state().await;
    state.request_pause(manifest_id.to_string());
    util::set_downloading_state(state).await;

    Ok(())
}

pub async fn resume_download(manifest_id: &str) -> Result<(), String> {
    let state = util::get_downloading_state().await;
    if !state.is_downloading(manifest_id) {
        return Err("No download in progress for this manifest".to_string());
    }

    let mut state = util::get_downloading_state().await;
    state.clear_pause_request(manifest_id);
    util::set_downloading_state(state).await;

    Ok(())
}