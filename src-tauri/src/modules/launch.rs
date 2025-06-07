use tauri::Emitter;

use crate::modules::{chunker, process, util};
use std::path::PathBuf;
use serde_json::json;

#[derive(Debug, Clone, serde::Deserialize)]
pub struct LaunchOptions {
  pub version: String,
  pub exchange_code: String,
  pub anticheat_token: String,
  pub root: PathBuf,
  pub simple_edit: bool,
  pub disable_pre_edits: bool,
  pub reset_on_release: bool,
  pub launch_args: String,
  pub manifest_id: Option<String>,
  pub anti_cheat_already_intialised: bool,
  pub do_not_update_paks: bool,
}

pub async fn launch_retrac(options: LaunchOptions) -> Result<(), String> {
  println!("Launching Retrac with options: {:?}", options);

  if options.manifest_id.is_some() {
    let manifest_id = options.manifest_id.unwrap();
    chunker::download_build(&manifest_id, options.root.to_str().unwrap()).await?;

    if manifest_id == "++Fortnite+Release-14.40-CL-14550713-Windows" {
      if !options.do_not_update_paks {
        chunker::download_build("Custom_Content", options.root.to_str().unwrap()).await?;
      }
      chunker::download_build("Anticheat_Client", options.root.to_str().unwrap()).await?;
    }
  }

  chunker::download_build("EAC_Client", options.root.to_str().unwrap()).await?;
  if !options.anti_cheat_already_intialised {
    let result = match process::launch_eac_setup(&options.root, "b2504259773b40e3a818f820e31979ca") {
      Ok(_) => true,
      Err(e) => {
        eprintln!("Failed to launch EAC setup: {}", e);
        false
      }
    };

    util::get_app_handle().emit("EAC_INITIALISED", json!({ "version": options.version, "status": result })).map_err(|e| {
      eprintln!("Failed to emit EAC_INITIALISED event: {}", e);
      "Failed to emit VERIFEAC_INITIALISEDING event".to_string()
    })?;
  }

  process::kill_all(&[
    "FortniteClient-Win64-Shipping_BE.exe",
    "FortniteClient-Win64-Shipping_EAC.exe",
    "FortniteClient-Win64-Shipping.exe",
    "EpicGamesLauncher.exe",
    "FortniteLauncher.exe",
  ])?;
  process::start_suspended(
    options
      .root
      .join("FortniteGame\\Binaries\\Win64\\FortniteLauncher.exe"),
  )?;
  process::start_suspended(
    options
      .root
      .join("FortniteGame\\Binaries\\Win64\\FortniteClient-Win64-Shipping_EAC.exe"),
  )?;

  process::start_with_args(options.root.join("Retrac_EAC.exe"), vec![
    "-epicapp=Fortnite",
    "-epiclocale=en-us",
    "-epicportal",
    "-nobe",
    "-fromfl=eac",
    "-fltoken=hchc0906bb1bg83c3934fa31",
    "-caldera=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiYmU5ZGE1YzJmYmVhNDQwN2IyZjQwZWJhYWQ4NTlhZDQiLCJnZW5lcmF0ZWQiOjE2Mzg3MTcyNzgsImNhbGRlcmFHdWlkIjoiMzgxMGI4NjMtMmE2NS00NDU3LTliNTgtNGRhYjNiNDgyYTg2IiwiYWNQcm92aWRlciI6IkVhc3lBbnRpQ2hlYXQiLCJub3RlcyI6IiIsImZhbGxiYWNrIjpmYWxzZX0.VAWQB67RTxhiWOxx7DBjnzDnXyyEnX7OljJm-j2d88G_WgwQ9wrE6lwMEHZHjBd1ISJdUO1UVUqkfLdU5nofBQ",
    "-skippatchcheck",
    "-noeac",
    "-AUTH_TYPE=exchangecode",
    "-AUTH_LOGIN=retrac",
    (format!("-AUTH_PASSWORD={}", options.exchange_code).as_str()),
    (format!("-actoken={}", options.anticheat_token).as_str()),
    (options.launch_args.as_str()),
    (if options.simple_edit { "-simpleedit" } else { "" }),
    (if options.disable_pre_edits { "-disablepreedit" } else { "" }),
    (if options.reset_on_release { "-instantreset" } else { "" }),
  ])?;

  Ok(())
}
