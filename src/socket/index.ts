import { create } from "zustand";
import { make, RetracSocket } from "src/socket/retrac_socket";

export type SocketManager = {
  socket: RetracSocket | null;
  event_listeners: Partial<{
    [K in SocketDownEventType]: SocketDownEventFn<K>[];
  }>;

  connect: (
    url: string,
    version: string,
    token: string,
    retries: number
  ) => void;
  disconnect: () => void;
  unlink_current_socket: () => void;

  bind: <T extends SocketDownEventType>(
    event: T,
    listener: SocketDownEventFn<T>
  ) => void;
  unbind: <T extends SocketDownEventType>(
    event: T,
    listener: SocketDownEventFn<T>
  ) => void;

  send: (event: Omit<SocketUpEvent, "version">) => void;
};

export const useLauncherSocket = create<SocketManager>()((set, get) => ({
  socket: null,
  event_listeners: {},

  connect: (url, version, token) => {
    const state = get();
    console.log("connecting with token", token);

    const socket = make(RetracSocket, url, version, state);
    if (socket === null) return;

    set({ socket });
  },
  disconnect: () => {
    const state = get();
    if (state.socket === null) return;
    state.socket.force_close();
    get().unlink_current_socket();
  },
  unlink_current_socket: () => {
    set({ socket: null });
  },

  bind: <T extends SocketDownEventType>(
    event: T,
    listener: SocketDownEventFn<T>
  ) => {
    const state = get();
    const listeners = state.event_listeners[event] || [];
    (listeners as SocketDownEventFn<T>[]).push(listener);
    state.event_listeners[event] = listeners;
    set({ event_listeners: state.event_listeners });
  },

  unbind: <T extends SocketDownEventType>(
    event: T,
    listener: SocketDownEventFn<T>
  ) => {
    const state = get();
    let listeners = state.event_listeners[event];
    if (listeners === undefined) return;

    (listeners as SocketDownEventFn<T>[]) = listeners.filter(
      (l) => l !== listener
    );
    state.event_listeners[event] = listeners;
    set({ event_listeners: state.event_listeners });
  },

  send: (event) => {
    const state = get();
    if (state.socket === null || state.socket.readyState !== WebSocket.OPEN)
      return;

    state.socket.send(
      JSON.stringify({
        ...event,
        version: state.socket.version,
      })
    );
  },
}));
