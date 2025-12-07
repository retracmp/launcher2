import { useEffect, useLayoutEffect } from "react";
import { useApplicationInformation } from "src/wrapper/tauri";
import {
  BANNER_DEFAULTS,
  bannerColours,
  useBannerManager,
} from "src/wrapper/banner";
import { LauncherStage, useUserManager } from "src/wrapper/user";
import { useRetrac } from "src/wrapper/retrac";
import { useLauncherSocket } from "src/sockets";
import { useServerManager } from "src/wrapper/server";
import { useOptions } from "src/wrapper/options";
import { useLeaderboard } from "src/wrapper/leaderboard";
import { LAUNCH_STATE, useLibrary } from "src/wrapper/library";
import * as app from "@tauri-apps/api/app";
import * as path from "@tauri-apps/api/path";
import invoke from "src/tauri";
import { endpoints_config } from "src/axios/endpoints";

const ANTI_SHORTCUTS = ["ctrl+p", "ctrl+f", "ctrl+u", "ctrl+j"];
const ANTI_SHORTCUTS_ALLOW_IN_DEV = ["ctrl+r", "f5"];

const Boostrap = () => {
  const application = useApplicationInformation();
  const bannerManager = useBannerManager();
  const userManager = useUserManager();
  const retrac = useRetrac();
  const socket = useLauncherSocket();
  const library = useLibrary();
  const servers = useServerManager();
  const options = useOptions();
  const leaderboard = useLeaderboard();

  const boostrap = async () => {
    console.log("[boostrap] bootstrapping application");

    application.load(
      await app.getName(),
      await app.getVersion(),
      import.meta.env.MODE === "development",
      (await invoke.get_windows_version()) || 0
    );

    options.fix_content_directory(await path.appLocalDataDir());
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
    socket.disconnect();
    if (userManager._token === null) return;
    if (application.version === "") return;

    const endpoints = endpoints_config(application);

    const tokenBase64 = btoa(userManager._token);
    socket.connect(
      `${endpoints.launcher_websocket_endpoint}?token=${tokenBase64}`,
      application.version,
      userManager._token,
      0
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
      expireAfter: 5,
    });
  };

  const onSocketWelcome = (data: SocketDownEvent_Welcome) => {
    console.log("[socket] welcome", data);
    socket.send({ id: "request_user" });
    socket.send({ id: "request_servers" });
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
      (data.extra_content_manifests || []).map((m) =>
        m.split("/").pop()!.replace(".acidmanifest", "")
      )
    );

    socket.send({
      id: "request_leaderboard",
      pagination: {
        page: leaderboard._page,
        pageSize: options.leaderboard_page_size,
        sortBy: leaderboard.activeSortedBy,
      },
    } as Omit<SocketUpEventDataFromType<"request_leaderboard">, "version">);
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

  const onSocketServers = (data: SocketDownEventDataFromType<"servers">) => {
    console.log("[socket] servers", data.servers);
    servers.set_servers(data.servers);
  };

  const onSocketServerCreated = (
    data: SocketDownEventDataFromType<"server_created">
  ) => {
    servers.set_server(data.server);
  };

  const onSocketServerUpdated = (
    data: SocketDownEventDataFromType<"server_updated">
  ) => {
    servers.set_server(data.server);
  };

  const onSocketServerDeleted = (
    data: SocketDownEventDataFromType<"server_deleted">
  ) => {
    servers.delete_server(data.server_id);
  };

  const onSocketDisplayNameChanged = (
    data: SocketDownEventDataFromType<"display_name_updated">
  ) => {
    userManager.set_new_username(data.newDisplayName);
    bannerManager.push({
      colour: "pink",
      id: "display_name_updated",
      text: `Your display name has been updated, please restart your game to see the changes.`,
      closable: true,
      expireAfter: 5,
    });
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
      socket.disconnect();
    };
  }, [userManager._token, application.version]);

  useEffect(() => {
    syncUserStages();

    socket.bind("close", onSocketClose);
    socket.bind("error", onSocketError);
    socket.bind("welcome", onSocketWelcome);
    socket.bind("request_heartbeat", onSocketRequestHeartbeat);
    socket.bind("user", onSocketUser);
    socket.bind("player_count", onSocketPlayerCount);
    socket.bind("servers", onSocketServers);
    socket.bind("server_created", onSocketServerCreated);
    socket.bind("server_updated", onSocketServerUpdated);
    socket.bind("server_deleted", onSocketServerDeleted);
    socket.bind("display_name_updated", onSocketDisplayNameChanged);

    return () => {
      socket.unbind("close", onSocketClose);
      socket.unbind("error", onSocketError);
      socket.unbind("welcome", onSocketWelcome);
      socket.unbind("request_heartbeat", onSocketRequestHeartbeat);
      socket.unbind("user", onSocketUser);
      socket.unbind("player_count", onSocketPlayerCount);
      socket.unbind("servers", onSocketServers);
      socket.unbind("server_created", onSocketServerCreated);
      socket.unbind("server_updated", onSocketServerUpdated);
      socket.unbind("server_deleted", onSocketServerDeleted);
      socket.unbind("display_name_updated", onSocketDisplayNameChanged);
    };
  }, []);

  useEffect(() => {
    const check = () => {
      if (bannerManager.exists("websocket_error") || !userManager.access()) {
        return bannerManager.remove("websocket");
      }

      if (socket.socket === null) {
        return bannerManager.push(BANNER_DEFAULTS.WEBSOCKET_NULL);
      }

      if (socket.socket.readyState === WebSocket.CONNECTING) {
        return bannerManager.push(BANNER_DEFAULTS.WEBSOCKET_CONNECTING);
      }

      if (socket.socket.readyState === WebSocket.CLOSED) {
        return bannerManager.push(BANNER_DEFAULTS.WEBSOCKET_CLOSED);
      }

      bannerManager.remove("websocket");
    };

    const interval = setInterval(check, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [socket.socket]);

  useEffect(() => {
    const check = async () => {
      const result = await invoke.is_fortnite_running();
      console.log(
        "[invoke.is_fortnite_running()] =",
        result,
        "[library.launchState] =",
        library.launchState
      );

      switch (library.launchState) {
        case LAUNCH_STATE.NONE:
          if (result) library.setLaunchState(LAUNCH_STATE.LAUNCHED);
          break;
        case LAUNCH_STATE.LAUNCHED:
          if (!result) library.setLaunchState(LAUNCH_STATE.NONE);
          break;
        case LAUNCH_STATE.LAUNCHING:
          if (result) library.setLaunchState(LAUNCH_STATE.LAUNCHED);
      }
    };

    const interval = setInterval(check, 3000);
    check();

    return () => {
      clearInterval(interval);
    };
  }, [library.launchState]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--RETRAC",
      options.custom_theme_colour
    );

    setTimeout(() => {
      document.body.style.setProperty("zoom", `${options.launcher_scale}`);
    }, 600);
  }, [options.custom_theme_colour, options.launcher_scale]);

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
