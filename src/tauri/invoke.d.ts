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
  exchange_code: string;
  anticheat_token: string;
  root: string;
  simple_edit: boolean;
  disable_pre_edits: boolean;
  reset_on_release: boolean;
  launch_args: string;
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
