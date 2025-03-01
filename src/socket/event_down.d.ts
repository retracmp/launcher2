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
};

type SocketDownEvent_RequestHeartbeat = SocketBasicDownEvent & {
  id: "request_heartbeat";
};

type SocketDownEvent_PlayerCount = SocketBasicDownEvent & {
  id: "player_count";
  count: number;
};

type SocketDownEvent_User = SocketBasicDownEvent & {
  id: "user";
  user: User;
};

type SocketDownEvent =
  | SocketDownEvent_Close
  | SocketDownEvent_Error
  | SocketDownEvent_Welcome
  | SocketDownEvent_RequestHeartbeat
  | SocketDownEvent_PlayerCount
  | SocketDownEvent_User;

type SocketDownEventType = SocketDownEvent["id"];
type SocketDownEventDataFromType<T extends SocketDownEventType> = Extract<
  SocketDownEvent,
  { id: T }
>;
type SocketDownEventFn<T extends SocketDownEventType> = (
  event: SocketDownEventDataFromType<T>
) => void;

//

type error_test = SocketDownEventDataFromType<"error">;
type welcome_test = SocketDownEventDataFromType<"welcome">;
type heartbeat_test = SocketDownEventDataFromType<"request_heartbeat">;
type player_count_test = SocketDownEventDataFromType<"player_count">;
type user_test = SocketDownEventDataFromType<"user">;
