type SocketBasicUpEvent = {
  version: string;
  id: string;
};

type SocketUpEvent_Heartbeat = SocketBasicUpEvent & {
  id: "heartbeat";
};

type SocketUpEvent = SocketUpEvent_Heartbeat;

type SocketUpEventType = SocketUpEvent["id"];
type SocketUpEventDataFromType<T extends SocketUpEventType> = Extract<
  SocketUpEvent,
  { id: T }
>;

//

type heartbeat_test = SocketUpEventDataFromType<"heartbeat">;
