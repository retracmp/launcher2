use sysinfo::{System, Signal};

pub fn kill_all(process_names: &[&str]) -> Result<(), String> {
  let mut system = System::new_all();
  system.refresh_all();

  for (pid, process) in system.processes() {
    for &target_name in process_names {
      if process.name().eq_ignore_ascii_case(target_name) {
        let result = process.kill_with(Signal::Kill);
        if result.is_none() || !result.unwrap() {
          return Err(format!("Failed to kill process {}: {}", target_name, pid));
        }
        break;
      }
    }
  }

  Ok(())
}

use std::path::PathBuf;
use std::ptr::null_mut;
use widestring::U16CString;
use winapi::um::processthreadsapi::{CreateProcessW, PROCESS_INFORMATION, STARTUPINFOW};
use winapi::um::winbase::{CREATE_SUSPENDED, DETACHED_PROCESS};
use winapi::um::minwinbase::LPSECURITY_ATTRIBUTES;
use winapi::um::handleapi::CloseHandle;

fn start_internal(process_path: PathBuf, suspended: bool, args: Option<String>) -> Result<(), String> {
  if !process_path.exists() {
    return Err(format!("Process path does not exist: {:?}", process_path));
  }

  let process_folder = process_path.parent()
    .ok_or_else(|| format!("Failed to get parent directory of process path: {:?}", process_path))?;
  let process_folder_wide = U16CString::from_str(process_folder.to_str().unwrap_or(""))
    .map_err(|e| format!("Failed to convert path to wide string: {}", e))?;
  let process_path_str = process_path.to_str()
    .ok_or_else(|| format!("Failed to convert path to string: {:?}", process_path))?;
  let application_name = U16CString::from_str(process_path_str)
    .map_err(|e| format!("Failed to convert path to wide string: {}", e))?;
  let cmd_line_wide = U16CString::from_str(&format!("\"{}\" {}", process_path_str, &args.unwrap_or_default()))
    .map_err(|e| format!("Failed to convert command line to wide string: {}", e))?;

  let mut startup_info: STARTUPINFOW = unsafe { std::mem::zeroed() };
  startup_info.cb = std::mem::size_of::<STARTUPINFOW>() as u32;
  let mut process_info: PROCESS_INFORMATION = unsafe { std::mem::zeroed() };

  let success = unsafe {
    CreateProcessW(
      application_name.into_raw() as *mut u16,
      cmd_line_wide.into_raw() as *mut u16,
      null_mut() as LPSECURITY_ATTRIBUTES,
      null_mut() as LPSECURITY_ATTRIBUTES,
      0,
      if suspended { CREATE_SUSPENDED } else { 0 } | DETACHED_PROCESS,
      null_mut(),
      process_folder_wide.into_raw() as *const u16,
      &mut startup_info,
      &mut process_info
    )
  };

  if success == 0 {
    let error_code = unsafe { winapi::um::errhandlingapi::GetLastError() };
    let error_message = format!("Failed to create process: {}", error_code);
    return Err(error_message);
  }

  unsafe {
    CloseHandle(process_info.hProcess);
    CloseHandle(process_info.hThread);
  }

  Ok(())
}

pub fn start(process_path: PathBuf) -> Result<(), String> {
  start_internal(process_path, false, None)
}

pub fn start_with_args(process_path: PathBuf, args: Vec<&str>) -> Result<(), String> {
  let args = args.into_iter().collect::<Vec<_>>().join(" ");
  start_internal(process_path, false, Some(args))
}

pub fn start_suspended(process_path: PathBuf) -> Result<(), String> {
  start_internal(process_path, true, None)
}

pub fn start_suspended_with_args(process_path: PathBuf, args: Vec<&str>) -> Result<(), String> {
  let args = args.into_iter().collect::<Vec<_>>().join(" ");
  start_internal(process_path, true, Some(args))
}