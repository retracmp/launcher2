import { useEffect, useLayoutEffect } from "react";
import { useApplicationInformation } from "src/wrapper/tauri";
import {
  BANNER_DEFAULTS,
  bannerColours,
  useBannerManager,
} from "src/wrapper/banner";
import { useUserManager } from "src/wrapper/user";
import { useSocket } from "src/socket";
import * as app from "@tauri-apps/api/app";

const ANTI_SHORTCUTS = ["ctrl+p", "ctrl+f", "ctrl+u", "ctrl+j"];

const Boostrap = () => {
  const application = useApplicationInformation();
  const bannerManager = useBannerManager();
  const userManager = useUserManager();
  const socket = useSocket();

  const boostrap = async () => {
    console.log("[boostrap] bootstrapping application");

    application.load(
      await app.getName(),
      await app.getVersion(),
      import.meta.env.MODE === "development"
    );
  };

  const nil = (e: MouseEvent) => e.preventDefault();
  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      (event.ctrlKey || event.metaKey) &&
      ANTI_SHORTCUTS.includes(`${event.ctrlKey ? "ctrl+" : ""}${event.key}`)
    ) {
      event.preventDefault();
    }

    if (event.key === "Tab") event.preventDefault();
  };

  const socketConnect = () => {
    if (socket._socket !== null) return;
    if (userManager._token === null) return;

    const tokenBase64 = btoa(userManager._token);
    socket.connect(
      `ws://localhost:3000/launcher/ws?token=${tokenBase64}`,
      application.version
    );
  };

  const onSocketError = (data: SocketDownEvent_Error) => {
    console.log("[socket] error", data);
    bannerManager.push({
      colour:
        data.colour_override != null
          ? (data.colour_override as keyof typeof bannerColours)
          : "red",
      id: "websocket_error",
      text: data.error,
      closable: true,
    });
  };

  const onSocketWelcome = (data: SocketDownEvent_Welcome) => {
    console.log("[socket] welcome", data);
    socket.send({ id: "request_user" });
  };

  const onSocketRequestHeartbeat = (data: SocketDownEvent_RequestHeartbeat) => {
    console.log("[socket] request_heartbeat", data);
    socket.send({ id: "heartbeat" });
  };

  const onSocketUser = (data: SocketDownEvent_User) => {
    console.log("[socket] user", data);
    userManager.load(data.user);
  };

  useEffect(() => {
    socketConnect();

    socket.bind("error", onSocketError);
    socket.bind("welcome", onSocketWelcome);
    socket.bind("request_heartbeat", onSocketRequestHeartbeat);
    socket.bind("user", onSocketUser);

    return () => {
      socket.unbind("error", onSocketError);
      socket.unbind("welcome", onSocketWelcome);
      socket.unbind("request_heartbeat", onSocketRequestHeartbeat);
      socket.unbind("user", onSocketUser);
    };
  }, [userManager._token]);

  useEffect(() => {
    const check = () => {
      if (bannerManager.exists("websocket_error")) {
        return bannerManager.remove("websocket");
      }

      if (socket._socket === null) {
        return bannerManager.push(BANNER_DEFAULTS.WEBSOCKET_NULL);
      }

      if (socket._socket.readyState === WebSocket.CONNECTING) {
        return bannerManager.push(BANNER_DEFAULTS.WEBSOCKET_CONNECTING);
      }

      if (socket._socket.readyState === WebSocket.CLOSED) {
        return bannerManager.push(BANNER_DEFAULTS.WEBSOCKET_CLOSED);
      }

      bannerManager.remove("websocket");
    };

    const interval = setInterval(check, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [socket._socket]);

  useLayoutEffect(() => {
    boostrap();

    document.addEventListener("contextmenu", nil);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", nil);
      document.removeEventListener("keydown", handleKeyDown);
      socket.disconnect();
    };
  }, []);

  return null;
};

export default Boostrap;
