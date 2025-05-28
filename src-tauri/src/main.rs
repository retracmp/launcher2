// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use std::env;

// pub mod modules;
// use modules::{commands, process};

/**
 * [src\main.rs:12:5] args.clone() = [
    "C:\\Users\\User\\Documents\\github\\launcher2\\src-tauri\\target\\debug\\retrac.exe",
    "-defender_add=C:\\Users\\User\\Documents\\fortnite\\++Fortnite+Release-14.40-CL-14550713-Windows",
    "-defender_add=C:\\Users\\User\\Documents\\fortnite\\++Fortnite+Release-14.40-CL-14550713-Windows/TemporaryChunks/Engine/Binaries/ThirdParty/NVIDIA/NVaftermath/Win64/GFSDK_Aftermath_Lib.x64.dll",
    "-defender_add=C:\\Users\\User\\Documents\\fortnite\\++Fortnite+Release-14.40-CL-14550713-Windows/Engine/Binaries/ThirdParty/NVIDIA/NVaftermath/Win64",
    "-action_after=launch_build:++Fortnite+Release-14.40-CL-14550713",
]
 */

#[tokio::main]
async fn main() {
    // let args: Vec<String> = env::args().collect();
    // dbg!(args.clone());

    // let args: Vec<String> = args.into_iter().skip(1).collect();

    // for arg in args.iter() {
    //     if arg.starts_with("-defender_add=") {
    //         let path = arg.replace("-defender_add=", "").trim_matches('"').to_string();
    //         let result = commands::add_to_defender(path.as_str()).await;
    //         match result {
    //             Ok(_) => {
    //                 println!("Successfully added to Defender: {}", path);
    //             }
    //             Err(e) => {
    //                 eprintln!("Failed to add to Defender: {}", e);
    //                 process::message_box(
    //                     "Failed to add to Defender",
    //                     &format!("Failed to add {} to Defender: {}", path, e),
    //                 ).unwrap();
    //                 return;
    //             }
    //         }
    //     }
    // }

    // retrac_launcher_lib::run(args.clone())

    retrac_launcher_lib::run(vec![]);
}
