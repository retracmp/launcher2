use std::fs::File;
use std::io::{Read, Seek};
use tauri::AppHandle;
use winver::WindowsVersion;

use crate::modules::{admin, chunker, launch, process, util 
  // admin
};

#[tauri::command]
pub async fn get_windows_version() -> Result<i32, String> {
  let version = WindowsVersion::detect().unwrap();
  Ok(version.build as i32)
}

#[tauri::command]
pub async fn get_fortnite_version(path: &str) -> Result<String, String> {
  let pattern: &[u8] = &[
    0x2B, 0x00, 0x2B, 0x00, 0x46, 0x00, 0x6F, 0x00, 0x72, 0x00, 0x74, 0x00, 0x6E, 0x00, 0x69,
    0x00, 0x74, 0x00, 0x65, 0x00, 0x2B, 0x00, 0x52, 0x00, 0x65, 0x00, 0x6C, 0x00, 0x65, 0x00,
    0x61, 0x00, 0x73, 0x00, 0x65, 0x00,
  ];

  let offset = util::search_file_for_bytes(path, pattern).await?;
  if offset.is_none() {
    return Err("Pattern not found".to_string());
  }
  let offset_real = offset.unwrap() as usize;
  // offset_real += pattern.len();

  let mut file = File::open(path).map_err(|e| e.to_string())?;
  file.seek(std::io::SeekFrom::Start(offset_real as u64))
    .map_err(|e| e.to_string())?;
  let mut buffer = vec![0; 256];
  file.read_exact(&mut buffer).map_err(|e| e.to_string())?;

  let version = util::find_fortnite_release(util::vec_u8_as_wide_to_string(buffer).as_str());
  if version.is_none() {
    return Err("Version not found".to_string());
  }

  Ok(version.unwrap())
}

#[tauri::command]
pub async fn launch_retrac(options: launch::LaunchOptions) -> Result<bool, String> {
  let result = launch::launch_retrac(options).await;
  match result {
    Ok(_) => Ok(true),
    Err(e) => Err(e),
  }
}

#[tauri::command]
pub async fn download_build(
  manifest_id: &str,
  download_path: &str,
  handle: AppHandle,
) -> Result<bool, String> {
  chunker::download_build_internal(manifest_id, download_path, handle).await
}

#[tauri::command]
pub async fn delete_build(
  manifest_id: &str,
  download_path: &str,
  handle: AppHandle,
) -> Result<bool, String> {
  chunker::delete_build_internal(manifest_id, download_path, handle).await
}

#[tauri::command]
pub async fn is_fortnite_running() -> Result<bool, String> {
  Ok(process::is_process_running(
    "FortniteClient-Win64-Shipping.exe",
  ))
}

#[tauri::command]
pub async fn close_fortnite() -> Result<bool, String> {
  let result = process::kill_all(&[
    "FortniteClient-Win64-Shipping_BE.exe",
    "FortniteClient-Win64-Shipping_EAC.exe",
    "FortniteClient-Win64-Shipping.exe",
    "EpicGamesLauncher.exe",
    "FortniteLauncher.exe",
  ]);
  match result {
    Ok(_) => Ok(true),
    Err(e) => Err(e),
  }
}

#[tauri::command]
pub async fn add_to_defender(
  path: &str,
) -> Result<bool, String> {
  admin::add_windows_defender_exclusions(path)
    .map_err(|e| e.to_string())?;

  Ok(true)
}

#[tauri::command]
pub async fn add_to_defender_multi(
) -> Result<bool, String> {
  Ok(true)
}

#[tauri::command]
pub async fn get_app_action() -> Result<String, String> {
  Ok(util::get_app_action())
}

#[tauri::command]
pub async fn cancel_download(
  manifest_id: &str,
) -> Result<bool, String> {
  let result = chunker::cancel_download(manifest_id).await;
  match result {
    Ok(_) => Ok(true),
    Err(e) => Err(e),
  }
}