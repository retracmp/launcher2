// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;

pub mod modules;
use modules::{commands, process};

#[tokio::main]
async fn main() {
    let args: Vec<String> = env::args().collect();
    dbg!(args.clone());

    if args.clone().len() > 1 && args.clone()[1].starts_with("-defender_add=") {
        let path = args[1].replace("-defender_add=", "").trim_matches('"').to_string();
        let result = commands::add_to_defender(path.as_str()).await;
        match result {
            Ok(_) => {
                println!("Successfully added to Defender: {}", path);
            }
            Err(e) => {
                eprintln!("Failed to add to Defender: {}", e);
                process::message_box(
                    "Failed to add to Defender",
                    &format!("Failed to add {} to Defender: {}", path, e),
                ).unwrap();
                return;
            }
        }
    }

    retrac_launcher_lib::run()
}
