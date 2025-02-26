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

type SocketUpEvent =
  | SocketUpEvent_Heartbeat
  | SocketUpEvent_RequestUser
  | SocketUpEvent_RequestCode;

type SocketUpEventType = SocketUpEvent["id"];
type SocketUpEventDataFromType<T extends SocketUpEventType> = Extract<
  SocketUpEvent,
  { id: T }
>;

//

type heartbeat_test = SocketUpEventDataFromType<"heartbeat">;
type user_test = SocketUpEventDataFromType<"request_user">;
type code_test = SocketUpEventDataFromType<"request_code">;
