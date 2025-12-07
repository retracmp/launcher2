import { SocketManager } from "src/sockets";
import { useUserManager } from "src/wrapper/user";

export class RetracSocket extends WebSocket {
  constructor(
    private websocket_uri: string,
    public version: string,
    private token: string,
    private controlling_manager: SocketManager
  ) {
    super(websocket_uri);

    this.open_handler = this.open_handler.bind(this);
    this.message_handler = this.message_handler.bind(this);
    this.close_handler = this.close_handler.bind(this);
    this.error_handler = this.error_handler.bind(this);

    this.addEventListener("open", this.open_handler);
    this.addEventListener("message", this.message_handler);
    this.addEventListener("close", this.close_handler);
    this.addEventListener("error", this.error_handler);
  }

  public force_close() {
    this.removeEventListener("close", this.close_handler);
    this.close();
    this.controlling_manager.connect(
      this.websocket_uri,
      this.version,
      this.token
    );
  }

  private open_handler() {
    console.log("socket has connected", "websocket uri", this.url);
    this.controlling_manager.send({ id: "heartbeat" });
  }

  private message_handler(event: MessageEvent) {
    const object = JSON.parse(event.data) as Record<string, unknown>;
    if (object === null || typeof object !== "object") return;
    if (!("id" in object) || typeof object.id !== "string") return;

    const t = this.controlling_manager.event_listeners;

    const T = object.id as keyof typeof t;
    const data = object as SocketDownEventDataFromType<typeof T>;

    const listeners = (t[data.id as keyof typeof t] || []) as SocketDownEventFn<
      typeof T
    >[];
    if (listeners === undefined) return;

    listeners.forEach((listener) => listener(data));
  }

  private close_handler(close_event: CloseEvent) {
    console.log("socket has disconnected");
    const t = this.controlling_manager.event_listeners;

    const close_listeners = (t["close"] || []) as SocketDownEventFn<"close">[];
    if (close_listeners !== undefined) {
      close_listeners.forEach((listener) => listener({ id: "close" }));
    }
    this.controlling_manager.unlink_current_socket();

    console.log("closing socket with code", close_event.code);
    if (close_event.code === 1006) return this.force_close();

    const error_listeners = (t["error"] || []) as SocketDownEventFn<"error">[];
    if (error_listeners === undefined) return;

    error_listeners.forEach((listener) =>
      listener({
        id: "error",
        error: `You have been disconnected from the server.`,
      })
    );
  }

  private error_handler(error: Event) {
    console.log("socket has recieved an error", "error", error);
    useUserManager.getState().logout();
    this.force_close();
  }
}

export const make = <T extends new (...args: any[]) => any>(
  ClassRef: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> | null => {
  try {
    const instance = new ClassRef(...args);
    return instance;
  } catch (error) {
    console.log("[socket] failed to connect", error);
    return null;
  }
};
