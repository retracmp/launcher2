import { SocketManager } from "src/socket";

type socketProps = {
  state: SocketManager;
  url: string;
  version: string;
};

export const socket = ({ state, url, version }: socketProps) => {
  const _socket = (() => {
    try {
      return new WebSocket(url);
    } catch (error) {
      console.log("[socket] failed to connect", error);
      return null;
    }
  })();
  if (_socket === null) return null;

  _socket.addEventListener("open", () => {
    state.send({ id: "heartbeat", version });
    state.bind("request_heartbeat", () =>
      state.send({ id: "heartbeat", version })
    );
    state.bind("error", (data) => {
      console.log("[socket] error", data.error);
      state.disconnect();
    });

    console.log("[socket] connected");
  });

  _socket.addEventListener("close", () => {
    console.log("[socket] disconnected");
    state.disconnect();
  });

  _socket.addEventListener("message", (event) => {
    const object = JSON.parse(event.data) as Record<string, unknown>;
    if (object === null || typeof object !== "object") return;
    if (!("id" in object) || typeof object.id !== "string") return;

    const T = object.id as keyof typeof state._listeners;
    const data = object as SocketDownEventDataFromType<typeof T>;

    const listeners = (state._listeners[
      data.id as keyof typeof state._listeners
    ] || []) as SocketDownEventFn<typeof T>[];
    if (listeners === undefined) return;

    listeners.forEach((listener) => listener(data));
  });

  _socket.onerror = (error) => {
    console.log("[socket] error", error);
    if (state._socket) state._socket.close();
  };

  return _socket;
};
