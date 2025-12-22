#[cfg(target_os = "windows")]
use std::env;
#[cfg(target_os = "windows")]
use std::ffi::OsString;
#[cfg(target_os = "windows")]
use std::ptr;
#[cfg(target_os = "windows")]
use std::fs::File;
#[cfg(target_os = "windows")]
use std::io::Read;
#[cfg(target_os = "windows")]
use std::os::windows::ffi::OsStrExt;
#[cfg(target_os = "windows")]
use winapi::um::shellapi::ShellExecuteW;

#[cfg(target_os = "windows")]
pub fn spawn_admin_process_and_get_output(command: &str, args: Vec<&str>) -> Result<String, String> {
  let cwd = env::current_dir().expect("Failed to get current working directory");
  let cwd_str = cwd.to_str().expect("Failed to convert path to string");
  
  let appdata = env::var("APPDATA").expect("Failed to get APPDATA environment variable");
  let appdata: std::path::PathBuf = appdata.into();
  let output_file: std::path::PathBuf = appdata.join("out");
  let output_file_str = output_file.to_str().expect("Failed to convert output path to string");
  
  let cwd_wide: Vec<u16> = OsString::from(cwd_str).encode_wide().chain(Some(0)).collect();
  let verb_wide: Vec<u16> = OsString::from("runas").encode_wide().chain(Some(0)).collect();
  let command_wide: Vec<u16> = OsString::from(command).encode_wide().chain(Some(0)).collect();
  
  let mut params = args.join(" ");
  params.push_str(&format!(" > \"{}\"", output_file_str));
  let params_wide: Vec<u16> = OsString::from(params).encode_wide().chain(Some(0)).collect();
  
  let result = unsafe {
    ShellExecuteW(
      ptr::null_mut(),
      verb_wide.as_ptr(),
      command_wide.as_ptr(),
      params_wide.as_ptr(),
      cwd_wide.as_ptr(),
      0,
    )
  };
  
  if result as isize <= 32 {
    return Err(format!("Failed to execute command"));
  }
  
  std::thread::sleep(std::time::Duration::from_millis(1500));
  
  let output_file = output_file.to_str().expect("Failed to convert output path to string");
  let file = File::open(output_file);
  if file.is_err() {
    return Err("Failed to open output file for reason {}".to_string() + &file.err().unwrap().to_string());
  }
  
  let mut final_file = file.unwrap();
  
  let mut file_data: Vec<u8> = Vec::new();
  final_file.read_to_end(&mut file_data).expect("Failed to read output file");
  
  let mut wide_file_data: Vec<u16> = Vec::new();
  for i in 0..file_data.len() / 2 {
    let byte1 = file_data[i * 2];
    let byte2 = file_data[i * 2 + 1];
    let u16_val = (byte2 as u16) << 8 | byte1 as u16;
    wide_file_data.push(u16_val);
  }
  
  let output = String::from_utf16(&wide_file_data).expect("Failed to convert output to string");
  std::fs::remove_file(output_file).expect("Failed to delete output file");
  
  Ok(output)
}

#[cfg(not(target_os = "windows"))]
pub fn spawn_admin_process_and_get_output(_command: &str, _args: Vec<&str>) -> Result<String, String> {
  Err("This function is only available on Windows".to_string())
}
  
#[cfg(target_os = "windows")]
pub fn add_windows_defender_exclusions(folder_path: &str) -> Result<bool, String> {
  let command = format!(
    "Add-MpPreference -ExclusionPath \"{}\"; (Get-MpPreference).ExclusionPath",
    folder_path
  );
  let output = spawn_admin_process_and_get_output("powershell", vec!["-Command", &command])?;

  if !output.contains(folder_path) {
    return Err("Failed to add folder to defender exclusion list, recieved output".to_string() + output.as_str());
  }

  Ok(true)
}

#[cfg(not(target_os = "windows"))]
pub fn add_windows_defender_exclusions(_folder_path: &str) -> Result<bool, String> {
  Err("Windows Defender exclusions are only available on Windows".to_string())
}