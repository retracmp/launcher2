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
  event_information: {
    events: EventItem[];
    style: EventStyle[];
  };
  manifest_information: ManifestInformation[];
  extra_content_manifests: string[];
};

type SocketDownEvent_RequestHeartbeat = SocketBasicDownEvent & {
  id: "request_heartbeat";
};

type SocketDownEvent_Code = SocketBasicDownEvent & {
  id: "code";
  code: string;
};

type SocketDownEvent_PlayerCount = SocketBasicDownEvent & {
  id: "player_count";
  count: number;
};

type SocketDownEvent_User = SocketBasicDownEvent & {
  id: "user";
  user: User;
};

type SocketDownEvent_FriendInfos = SocketBasicUpEvent & {
  id: "friend_infos";
  friendInformation: FriendInformation[];
};

type SocketDownEvent_Leaderboard = SocketBasicUpEvent & {
  id: "leaderboard";
  leaderboard: LeaderboardEntry[];
  you: LeaderboardEntry;
  pageInfo: LeaderboardPageInfo;
};

type SocketDownEvent_Usernames = SocketBasicUpEvent & {
  id: "user_names";
  friendInformation: Record<string, string>;
};

type SocketDownEvent_ServerCreated = SocketBasicUpEvent & {
  id: "server_created";
  server: BackendServer;
};

type SocketDownEvent_ServerUpdated = SocketBasicUpEvent & {
  id: "server_updated";
  server: BackendServer;
};

type SocketDownEvent_ServerDeleted = SocketBasicUpEvent & {
  id: "server_deleted";
  server_id: string;
};

type SocketDownEvent_Servers = SocketBasicUpEvent & {
  id: "servers";
  servers: BackendServer[];
};

type SocketDownEvent =
  | SocketDownEvent_Close
  | SocketDownEvent_Error
  | SocketDownEvent_Welcome
  | SocketDownEvent_RequestHeartbeat
  | SocketDownEvent_PlayerCount
  | SocketDownEvent_User
  | SocketDownEvent_FriendInfos
  | SocketDownEvent_Leaderboard
  | SocketDownEvent_Usernames
  | SocketDownEvent_Code
  | SocketDownEvent_ServerCreated
  | SocketDownEvent_ServerUpdated
  | SocketDownEvent_ServerDeleted
  | SocketDownEvent_Servers;

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
