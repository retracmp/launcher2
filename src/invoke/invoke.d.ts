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
  edit_on_release: boolean;
  reset_on_release: boolean;
  launch_args: string;
};
