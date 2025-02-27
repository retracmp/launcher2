import { SocketManager } from "src/socket";
import { useUserManager } from "src/wrapper/user";

export class RetracSocket extends WebSocket {
  public version: string;
  public token: string | null = null;

  constructor(url: string, version: string, token: string) {
    super(url);
    this.version = version;
    this.token = token;
  }
}

type socketProps = {
  state: SocketManager;
  url: string;
  version: string;
  token: string;
};

export const newRetracSocket = ({
  state,
  url,
  version,
  token,
}: socketProps): RetracSocket | null => {
  const _socket = (() => {
    try {
      return new RetracSocket(url, version, token);
    } catch (error) {
      console.log("[socket] failed to connect", error);
      return null;
    }
  })();
  if (_socket === null) return null;

  _socket.addEventListener("open", () => {
    state.send({ id: "heartbeat" });
    console.log("[socket] connected");
  });

  _socket.addEventListener("close", (e) => {
    console.log("[socket] disconnected");

    const error_listeners = (state._listeners["error"] ||
      []) as SocketDownEventFn<"error">[];
    if (error_listeners !== undefined) {
      error_listeners.forEach((listener) =>
        listener({
          id: "error",
          error: `You have been disconnected from the server. (code ${e.code})`,
        })
      );
    }
    if (e.code === 1006) {
      state.disconnect();
      useUserManager.getState().logout();
      return;
    }

    const close_listeners = (state._listeners["close"] ||
      []) as SocketDownEventFn<"close">[];
    if (close_listeners !== undefined) {
      close_listeners.forEach((listener) => listener({ id: "close" }));
    }

    state.disconnect();
    setTimeout(() => state.connect(url, version, token), 2000);
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

  _socket.addEventListener("error", (error) => {
    console.log("[socket] error", error);
  });

  return _socket;
};
