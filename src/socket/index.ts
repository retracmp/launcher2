import { create } from "zustand";
import { RetracSocket, newRetracSocket } from "src/socket/handler";

export type SocketManager = {
  _socket: RetracSocket | null;
  _listeners: Partial<{ [K in SocketDownEventType]: SocketDownEventFn<K>[] }>;

  connect: (url: string, version: string) => void;
  disconnect: () => void;

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

export const useSocket = create<SocketManager>()((set, get) => ({
  _socket: null,
  _listeners: {},
  _onclose: [],

  connect: (url, version) => {
    const state = get();
    if (state._socket !== null) return;

    const _socket = newRetracSocket({
      state,
      url,
      version,
    });
    if (_socket === null) return;

    set({ _socket });
  },
  disconnect: () => {
    const state = get();
    if (state._socket === null) return;
    state._socket.close();
    set({ _socket: null });
  },

  bind: <T extends SocketDownEventType>(
    event: T,
    listener: SocketDownEventFn<T>
  ) => {
    const state = get();
    const listeners = state._listeners[event] || [];
    (listeners as SocketDownEventFn<T>[]).push(listener);
    state._listeners[event] = listeners;
    set({ _listeners: state._listeners });
  },

  unbind: <T extends SocketDownEventType>(
    event: T,
    listener: SocketDownEventFn<T>
  ) => {
    const state = get();
    let listeners = state._listeners[event];
    if (listeners === undefined) return;

    (listeners as SocketDownEventFn<T>[]) = listeners.filter(
      (l) => l !== listener
    );
    state._listeners[event] = listeners;
    set({ _listeners: state._listeners });
  },

  send: (event) => {
    const state = get();
    if (state._socket === null || state._socket.readyState !== WebSocket.OPEN)
      return;

    state._socket.send(
      JSON.stringify({
        ...event,
        version: state._socket.version,
      })
    );
  },
}));
