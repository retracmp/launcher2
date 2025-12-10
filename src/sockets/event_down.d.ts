type SocketBasicDownEvent = {
  id: string;
};

type SocketDownEvent_Close = SocketBasicDownEvent & {
  id: "close";
};

type SocketDownEvent_Error = SocketBasicDownEvent & {
  id: "error";
  error: string;
  colour_override?: string;
};

type SocketDownEvent_Welcome = SocketBasicDownEvent & {
  id: "welcome";
  news: LauncherNewsItem[];
  manifest_information: ManifestInformation[];
  extra_content_manifests: string[];
};

type SocketDownEvent_RequestHeartbeat = SocketBasicDownEvent & {
  id: "request_heartbeat";
};

type SocketDownEvent_Code = SocketBasicDownEvent & {
  id: "code";
  authorisation_code: string;
  anticheat_token: string;
};

type SocketDownEvent_PlayerCount = SocketBasicDownEvent & {
  id: "player_count";
  count: number;
};

type SocketDownEvent_User = SocketBasicDownEvent & {
  id: "user";
  user: User;
};

type SocketDownEvent_FriendInfo = SocketBasicDownEvent & {
  id: "friend_infos";
  friendInformation: FriendInformation[];
};

type SocketDownEvent_FriendInfoUpdate = SocketBasicDownEvent & {
  id: "friend_info_update";
  friendInformation: FriendInformation;
};

type SocketDownEvent_Leaderboard = SocketBasicDownEvent & {
  id: "leaderboard";
  leaderboard: LeaderboardEntry[];
  leaderboard_ranks: Record<string, AggregatedStats>;
  page_information: LeaderboardPageInfo;
  rank_information: LeaderboardRankInformation;
};

type SocketDownEvent_Stats = SocketBasicDownEvent & {
  id: "stats";
  server: AggregatedStats;
};

type SocketDownEvent_Usernames = SocketBasicDownEvent & {
  id: "user_names";
  user_names: Record<string, string>;
};

type SocketDownEvent_ServerCreated = SocketBasicDownEvent & {
  id: "server_created";
  server: Match;
};

type SocketDownEvent_ServerUpdated = SocketBasicDownEvent & {
  id: "server_updated";
  server: Match;
};

type SocketDownEvent_ServerDeleted = SocketBasicDownEvent & {
  id: "server_deleted";
  server_id: string;
};

type SocketDownEvent_Servers = SocketBasicDownEvent & {
  id: "servers";
  servers: Match[];
};

type SocketDownEvent_OTP = SocketBasicDownEvent & {
  id: "otp";
  otp: string;
};

type SocketDownEvent_DisplayNameUpdated = SocketBasicDownEvent & {
  id: "display_name_updated";
  newDisplayName: string;
};

type SocketDownEvent_AggregatedStats = SocketBasicDownEvent & {
  id: "aggregated_stats";
  aggregated_stats: AggregatedStats;
};

type SocketDownEvent =
  | SocketDownEvent_Close
  | SocketDownEvent_Error
  | SocketDownEvent_Welcome
  | SocketDownEvent_RequestHeartbeat
  | SocketDownEvent_PlayerCount
  | SocketDownEvent_User
  | SocketDownEvent_FriendInfo
  | SocketDownEvent_FriendInfoUpdate
  | SocketDownEvent_Leaderboard
  | SocketDownEvent_Usernames
  | SocketDownEvent_Code
  | SocketDownEvent_ServerCreated
  | SocketDownEvent_ServerUpdated
  | SocketDownEvent_ServerDeleted
  | SocketDownEvent_Servers
  | SocketDownEvent_OTP
  | SocketDownEvent_DisplayNameUpdated
  | SocketDownEvent_AggregatedStats;

type SocketDownEventType = SocketDownEvent["id"];
type SocketDownEventDataFromType<T extends SocketDownEventType> = Prettify<
  Extract<SocketDownEvent, { id: T }>
>;
type SocketDownEventFn<T extends SocketDownEventType> = (
  event: SocketDownEventDataFromType<T>
) => void;

//
type close_test = SocketDownEventDataFromType<"close">;
type error_test = SocketDownEventDataFromType<"error">;
type welcome_test = SocketDownEventDataFromType<"welcome">;
type heartbeat_test = SocketDownEventDataFromType<"request_heartbeat">;
type player_count_test = SocketDownEventDataFromType<"player_count">;
type user_test = SocketDownEventDataFromType<"user">;
type friend_infos_test = SocketDownEventDataFromType<"friend_infos">;
type leaderboard_test = SocketDownEventDataFromType<"leaderboard">;
type usernames_test = SocketDownEventDataFromType<"user_names">;
type code_test = SocketDownEventDataFromType<"code">;
type server_created_test = SocketDownEventDataFromType<"server_created">;
type server_updated_test = SocketDownEventDataFromType<"server_updated">;
type server_deleted_test = SocketDownEventDataFromType<"server_deleted">;
type servers_test = SocketDownEventDataFromType<"servers">;
type otp_test = SocketDownEventDataFromType<"otp">;
type change_displayname_test =
  SocketDownEvent_DisplayNameUpdated<"displayName_updated">;
