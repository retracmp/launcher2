use tauri::Manager;
use tauri_plugin_deep_link::DeepLinkExt;
use winver::WindowsVersion;
use std::fs::File;
use std::io::{Read, Seek};

mod util;
mod launch;

#[tauri::command]
async fn get_windows_version() -> Result<i32, String> {
  let version = WindowsVersion::detect().unwrap();
  Ok(version.build as i32)
}

#[tauri::command]
async fn get_fortnite_version(path: &str) -> Result<String, String> {
  let pattern: &[u8] = &[
    0x2B, 0x00, 0x2B, 0x00,
    0x46, 0x00, 0x6F, 0x00,
    0x72, 0x00, 0x74, 0x00,
    0x6E, 0x00, 0x69, 0x00,
    0x74, 0x00, 0x65, 0x00,
    0x2B, 0x00, 0x52, 0x00,
    0x65, 0x00, 0x6C, 0x00,
    0x65, 0x00, 0x61, 0x00,
    0x73, 0x00, 0x65, 0x00,
  ];

  let offset = util::search_file_for_bytes(path, pattern).await?;
  if offset.is_none() {
    return Err("Pattern not found".to_string());
  }
  let offset_real = offset.unwrap() as usize;
  // offset_real += pattern.len();
  
  let mut file = File::open(path).map_err(|e| e.to_string())?;
  file.seek(std::io::SeekFrom::Start(offset_real as u64)).map_err(|e| e.to_string())?;
  let mut buffer = vec![0; 256];
  file.read_exact(&mut buffer).map_err(|e| e.to_string())?;
  
  let version = util::find_fortnite_release(util::vec_u8_as_wide_to_string(buffer).as_str());
  if version.is_none() {
    return Err("Version not found".to_string());
  }

  Ok(version.unwrap())
}

#[tauri::command]
async fn launch_retrac(options: launch::LaunchOptions) -> Result<bool, String> {
  let result = launch::launch_retrac(options);
  match result {
    Ok(_) => Ok(true),
    Err(e) => Err(e),
  }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let mut builder = tauri::Builder::default();

  builder = builder.plugin(tauri_plugin_single_instance::init(|_app, _argv, _cwd| {}));
  builder = builder.plugin(tauri_plugin_deep_link::init());
  builder = builder.plugin(tauri_plugin_opener::init());
  builder = builder.plugin(tauri_plugin_dialog::init());
  builder = builder.invoke_handler(tauri::generate_handler![
    #[cfg(target_os = "windows")]
    get_windows_version,
    get_fortnite_version,
    launch_retrac
  ]);

  builder = builder.setup(|app| {
    let main_window = app.get_webview_window("main").expect("no main window");

    if main_window.set_shadow(true).is_err() {
      eprintln!("Failed to set window shadow");
    }

    #[cfg(desktop)]
    app.deep_link().register("retrac")?;

    Ok(())
  });

  builder.run(tauri::generate_context!()).expect("error while running tauri application");
}
