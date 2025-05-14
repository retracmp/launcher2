import { useEffect, useLayoutEffect } from "react";
import { useApplicationInformation } from "src/wrapper/tauri";
import {
  BANNER_DEFAULTS,
  bannerColours,
  useBannerManager,
} from "src/wrapper/banner";
import { LauncherStage, useUserManager } from "src/wrapper/user";
import { hostname, dev } from "src/axios/client";
import { useRetrac } from "src/wrapper/retrac";
import { useSocket } from "src/socket";
import * as app from "@tauri-apps/api/app";
import invoke from "src/tauri";

const ANTI_SHORTCUTS = ["ctrl+p", "ctrl+f", "ctrl+u", "ctrl+j"];
const ANTI_SHORTCUTS_ALLOW_IN_DEV = ["ctrl+r", "f5"];

const Boostrap = () => {
  const application = useApplicationInformation();
  const bannerManager = useBannerManager();
  const userManager = useUserManager();
  const retrac = useRetrac();
  const socket = useSocket();

  const boostrap = async () => {
    console.log("[boostrap] bootstrapping application");

    application.load(
      await app.getName(),
      await app.getVersion(),
      import.meta.env.MODE === "development",
      (await invoke.get_windows_version()) || 0
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

    if (import.meta.env.MODE !== "development") {
      if (
        (event.ctrlKey || event.metaKey) &&
        ANTI_SHORTCUTS_ALLOW_IN_DEV.includes(
          `${event.ctrlKey ? "ctrl+" : ""}${event.key}`
        )
      ) {
        event.preventDefault();
      }

      if (
        ANTI_SHORTCUTS_ALLOW_IN_DEV.includes(event.key.toLowerCase()) &&
        event.key.startsWith("F")
      ) {
        event.preventDefault();
      }
    }

    if (event.key === "Tab") event.preventDefault();
  };

  const socketConnect = () => {
    if (userManager._token === null) return;
    if (socket._socket !== null && socket._socket.token === userManager._token)
      return;
    if (socket._socket !== null) socket.disconnect();

    const tokenBase64 = btoa(userManager._token);
    socket.connect(
      `ws${dev ? "" : "s"}://${hostname}/launcher/ws?token=${tokenBase64}`,
      application.version,
      userManager._token
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
    retrac.set_launcher_news(data.news);
    retrac.set_events(
      data.event_information.events.map((e) => {
        return {
          event: e,
          style: data.event_information.style.find(
            (s) => s.tournament_display_id === e.DisplayID
          )!,
        };
      })
    );
    retrac.set_manifests(data.manifest_information);
    retrac.set_auto_download_manifests(
      data.extra_content_manifests.map((m) =>
        m.split("/").pop()!.replace(".acidmanifest", "")
      )
    );
  };

  const onSocketRequestHeartbeat = (data: SocketDownEvent_RequestHeartbeat) => {
    console.log("[socket] request_heartbeat", data);
    socket.send({ id: "heartbeat" });
  };

  const onSocketUser = (data: SocketDownEvent_User) => {
    console.log("[socket] user", data);
    userManager.load(data.user);
  };

  const onSocketClose = (data: SocketDownEvent_Close) => {
    console.log("[socket] close", data);
  };

  const onSocketPlayerCount = (data: SocketDownEvent_PlayerCount) => {
    retrac.set_players_online(data.count);
  };

  const syncUserStages = () => {
    if (
      userManager._token != null &&
      userManager._stage === LauncherStage.NoToken
    ) {
      userManager.set_stage(LauncherStage.TestingToken);
    }

    if (
      userManager._token === null &&
      userManager._stage !== LauncherStage.NoToken
    ) {
      userManager.set_stage(LauncherStage.NoToken);
    }
  };

  useEffect(() => {
    socketConnect();

    return () => {
      if (socket._socket !== null) {
        socket.disconnect();
      }
    };
  }, [userManager._token]);

  useEffect(() => {
    syncUserStages();

    socket.bind("close", onSocketClose);
    socket.bind("error", onSocketError);
    socket.bind("welcome", onSocketWelcome);
    socket.bind("request_heartbeat", onSocketRequestHeartbeat);
    socket.bind("user", onSocketUser);
    socket.bind("player_count", onSocketPlayerCount);

    return () => {
      socket.unbind("close", onSocketClose);
      socket.unbind("error", onSocketError);
      socket.unbind("welcome", onSocketWelcome);
      socket.unbind("request_heartbeat", onSocketRequestHeartbeat);
      socket.unbind("user", onSocketUser);
      socket.unbind("player_count", onSocketPlayerCount);
    };
  }, []);

  useEffect(() => {
    const check = () => {
      if (bannerManager.exists("websocket_error") || !userManager.access()) {
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
    };
  }, []);

  return null;
};

export default Boostrap;
