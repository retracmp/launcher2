type SocketBasicUpEvent = {
  version: string;
  id: string;
};

type SocketUpEvent_Heartbeat = SocketBasicUpEvent & {
  id: "heartbeat";
};

type SocketUpEvent_RequestUser = SocketBasicUpEvent & {
  id: "request_user";
};

type SocketUpEvent_RequestCode = SocketBasicUpEvent & {
  id: "request_code";
};

type SocketUpEvent_RequestFriendInfo = SocketBasicUpEvent & {
  id: "request_friend_info";
  friendIds: string[];
};

type SocketUpEvent =
  | SocketUpEvent_Heartbeat
  | SocketUpEvent_RequestUser
  | SocketUpEvent_RequestCode
  | SocketUpEvent_RequestFriendInfo;

type SocketUpEventType = SocketUpEvent["id"];
type SocketUpEventDataFromType<T extends SocketUpEventType> = Extract<
  SocketUpEvent,
  { id: T }
>;

//

type heartbeat_test = SocketUpEventDataFromType<"heartbeat">;
type user_test = SocketUpEventDataFromType<"request_user">;
type code_test = SocketUpEventDataFromType<"request_code">;
type friend_info_test = SocketUpEventDataFromType<"request_friend_info">;
