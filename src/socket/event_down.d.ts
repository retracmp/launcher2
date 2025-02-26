type SocketBasicDownEvent = {
  id: string;
};

type SocketDownEvent_Error = SocketBasicDownEvent & {
  id: "error";
  error: string;
};

type SocketDownEvent_RequestHeartbeat = SocketBasicDownEvent & {
  id: "request_heartbeat";
};

type SocketDownEvent_RequestLogout = SocketBasicDownEvent & {
  id: "request_logout";
};

type SocketDownEvent =
  | SocketDownEvent_Error
  | SocketDownEvent_RequestHeartbeat
  | SocketDownEvent_RequestLogout;

type SocketDownEventType = SocketDownEvent["id"];
type SocketDownEventDataFromType<T extends SocketDownEventType> = Extract<
  SocketDownEvent,
  { id: T }
>;
type SocketDownEventFn<T extends SocketDownEventType> = (
  event: SocketDownEventDataFromType<T>
) => void;

//

type heartbeat_test = SocketDownEventDataFromType<"request_heartbeat">;
type logout_test = SocketDownEventDataFromType<"request_logout">;
