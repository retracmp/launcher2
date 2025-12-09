use futures_util::lock::Mutex;
use regex::Regex;

use std::convert::TryInto;
use std::fs::File;
use std::io::Read;

use std::sync::{LazyLock, OnceLock};
use tauri::AppHandle;

use super::chunker;

static APP_HANDLE: OnceLock<AppHandle> = OnceLock::new();

pub fn set_app_handle(handle: AppHandle) {
    APP_HANDLE.set(handle).unwrap();
}

pub fn get_app_handle() -> AppHandle {
    APP_HANDLE.get().unwrap().clone()
}

static APP_ACTION: OnceLock<String> = OnceLock::new();

pub fn set_app_action(args: String) {
    APP_ACTION.set(args).unwrap();
}

pub fn get_app_action() -> String {
    APP_ACTION.get().cloned().unwrap_or_default()
}

static DOWNLOADING_STATE: LazyLock<Mutex<chunker::DownloadingStateTauri>> =
    LazyLock::new(|| Mutex::new(chunker::DownloadingStateTauri::default()));

pub async fn get_downloading_state() -> chunker::DownloadingStateTauri {
    let state = DOWNLOADING_STATE.lock().await;
    state.clone()
}

pub async fn set_downloading_state(state: chunker::DownloadingStateTauri) {
    let mut state_lock = DOWNLOADING_STATE.lock().await;
    *state_lock = state;
}

pub async fn search_file_for_bytes(path: &str, pattern: &[u8]) -> Result<Option<usize>, String> {
    let file: Result<File, std::io::Error> = File::open(path);
    if file.is_err() {
        return Err(format!("Failed to open file: {}", path));
    }

    let mut buffer = Vec::new();
    let result = file.unwrap().read_to_end(&mut buffer);
    if result.is_err() {
        return Err(format!("Failed to read file: {}", path));
    }

    let offset = find_subslice(&buffer, pattern);
    if offset.is_none() {
        return Ok(None);
    }

    let offset = offset.unwrap(); // + pattern.len();
    Ok(Some(offset))
}

fn find_subslice(haystack: &[u8], needle: &[u8]) -> Option<usize> {
    haystack
        .windows(needle.len())
        .position(|window| window == needle)
}

pub fn vec_u8_as_wide_to_string(vec: Vec<u8>) -> Result<String, String> {
    let vec = if vec.len() % 2 != 0 {
        let mut v = vec;
        v.push(0);
        v
    } else {
        vec
    };

    let u16_vec: Vec<u16> = vec
        .chunks_exact(2)
        .map(|chunk| u16::from_le_bytes(chunk.try_into().unwrap()))
        .collect();

    match String::from_utf16(&u16_vec) {
        Ok(s) => Ok(s),
        Err(_) => {
            Ok(String::from_utf16_lossy(&u16_vec))
        }
    }
}

pub fn find_fortnite_release(input: &str) -> Option<String> {
    let cleaned_input = input
        .as_bytes()
        .iter()
        .map(|&b| if b == 0 { b' ' } else { b })
        .collect::<Vec<u8>>();
    let cleaned_input_str = String::from_utf8(cleaned_input).unwrap_or_default();
    let pattern = r"\+\+Fortnite\+Release[^\s]+-CL-[^\s]*";
    let re = Regex::new(pattern).unwrap();

    if let Some(matched) = re.find(&cleaned_input_str) {
        let result = matched
            .as_str()
            .split_whitespace()
            .last()
            .unwrap_or_default()
            .to_string();
        return Some(result);
    }

    None
}
