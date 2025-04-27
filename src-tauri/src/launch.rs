#[derive(Debug, Clone, serde::Deserialize)]
pub struct LaunchOptions {
  pub exchange_code: String,
  pub anticheat_token: String,
  pub root: String,
  pub simple_edit: bool,
  pub disable_pre_edits: bool,
  pub reset_on_release: bool,
  pub launch_args: String,
}

pub fn launch_retrac(options: LaunchOptions) -> Result<(), String> {
  println!("Launching Retrac with options: {:?}", options);

  Ok(())
}