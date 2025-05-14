use tauri::Manager;
use tauri_plugin_deep_link::DeepLinkExt;

pub mod modules;
use modules::{commands, util};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let mut builder = tauri::Builder::default();

  builder = builder.plugin(tauri_plugin_single_instance::init(|_app, _argv, _cwd| {}));
  builder = builder.plugin(tauri_plugin_deep_link::init());
  builder = builder.plugin(tauri_plugin_opener::init());
  builder = builder.plugin(tauri_plugin_dialog::init());

  builder = builder.setup(|app| {
    let handle = app.handle();
    util::set_app_handle(handle.to_owned());

    let main_window = app.get_webview_window("main").expect("no main window");
    if main_window.set_shadow(true).is_err() {
      eprintln!("Failed to set window shadow");
    }

    #[cfg(desktop)]
    app.deep_link().register("retrac")?;

    Ok(())
  });

  builder = builder.invoke_handler(tauri::generate_handler![
    #[cfg(target_os = "windows")]
    commands::get_windows_version,
    commands::get_fortnite_version,
    commands::launch_retrac,
    commands::download_build,
  ]);

  builder.run(tauri::generate_context!()).expect("error while running tauri application");
}
