// pub struct LaunchOptions {
//   pub exchange_code: String,
//   pub anticheat_token: String,
//   pub root: String,
//   pub simple_edit: bool,
//   pub edit_on_release: bool,
//   pub reset_on_release: bool,
//   pub launch_args: String,
// }

type LaunchOptions = {
  version: string;
  exchange_code: string;
  anticheat_token: string;
  root: string;
  simple_edit: boolean;
  disable_pre_edits: boolean;
  reset_on_release: boolean;
  launch_args: string;
  manifest_id?: string;
  anti_cheat_already_intialised: boolean;
  do_not_update_paks: boolean;
  bubble_builds_enabled: boolean;
  mobile_builds_enabled: boolean;
  custom_dll_path?: string;
  override_password?: string;
};

// pub struct ManifestProgress {
//   downloaded_bytes: u64,
//   total_bytes: u64,
//   percent: f64,
//   speed_mbps: f64,
//   eta_seconds: u64,
//   manifest_id: String,
//   current_file: Option<String>,
//   wants_cancel: bool,
// }

type ManifestProgress = {
  downloaded_bytes: number;
  total_bytes: number;
  percent: number;
  speed_mbps: number;
  eta_seconds: number;
  manifest_id: string;
  current_files: string[];
  wants_cancel: boolean;
};

type VerifyingInformation = {
  manifest_id: string;
  status: bool;
};

type ManifestVerifyProgress = {
  current_file: string;
  checked_files: number;
  total_files: number;
  manifest_id: string;
};

type VERIFYING_STATUS = {
  manifest_id: string;
  status: boolean;
};

type EAC_INITIALISED = {
  version: string;
  manifest_id: string;
  status: boolean;
};

type DOWNLOAD_ERROR = {
  manifest_id: string;
  error: string;
};
