import { useEffect, useLayoutEffect } from "react";
import { useApplicationInformation } from "src/wrapper/tauri";
import { BANNER_DEFAULTS, useBannerManager } from "src/wrapper/banner";
import { useSocket } from "src/socket";
import * as app from "@tauri-apps/api/app";

const ANTI_SHORTCUTS = ["ctrl+p", "ctrl+f", "ctrl+u", "ctrl+j"];

const Boostrap = () => {
  const application = useApplicationInformation();
  const bannerManager = useBannerManager();
  const socket = useSocket();

  const boostrap = async () => {
    console.log("[boostrap] bootstrapping application");

    application.load(
      await app.getName(),
      await app.getVersion(),
      import.meta.env.MODE === "development"
    );

    socket.connect(
      "ws://localhost:3000/launcher/ws?token=ectrc",
      application.version
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

  const onSocketError = (data: SocketDownEvent_Error) => {
    console.log("[socket] error", data);
    bannerManager.push({
      colour: "red",
      id: "websocket_error",
      text: data.error,
      closable: true,
    });
  };

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

    socket.bind("error", onSocketError);

    return () => {
      clearInterval(interval);
      socket.unbind("error", onSocketError);
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
