import { useOptions } from "src/wrapper/options";
import { useCallback, useEffect } from "react";
import { useDownloadState } from "src/wrapper/download";
import { useRetrac } from "src/wrapper/retrac";
import { event } from "@tauri-apps/api";
import { useLibrary } from "src/wrapper/library";
import { useUserManager } from "src/wrapper/user";
import { useSocket } from "src/socket";
import { useBannerManager } from "src/wrapper/banner";
import invoke from "src/tauri";

const TauriListeners = () => {
  const downloadState = useDownloadState();
  const options = useOptions();
  const user = useUserManager();
  const library = useLibrary();
  const socket = useSocket();
  const retrac = useRetrac();
  const banners = useBannerManager();

  const onDownloadEvent = useCallback(
    (progress: event.Event<ManifestProgress>) => {
      downloadState.set_active_download_progress(
        progress.payload.manifest_id,
        progress.payload
      );

      downloadState.add_timed_metabytes(
        progress.payload.manifest_id,
        new Date(),
        progress.payload.speed_mbps
      );

      if (progress.payload.percent === 100) {
        downloadState.remove_active_download_progress(
          progress.payload.manifest_id
        );
      }

      console.log(`[download] ${progress.payload.manifest_id}
        downloaded_bytes: ${progress.payload.downloaded_bytes}
        total_bytes: ${progress.payload.total_bytes}
        percent: ${progress.payload.percent}%
        files: [${progress.payload.current_files.join(", ")}]
        speed_mbps: ${progress.payload.speed_mbps}
        eta_seconds: ${progress.payload.eta_seconds}`);
    },
    []
  );

  const onDownloadErrorAdvancedEvent = useCallback(
    (error: event.Event<DOWNLOAD_ERROR>) => {
      downloadState.remove_active_download_progress(error.payload.manifest_id);
      downloadState.remove_active_verifying_progress(error.payload.manifest_id);
    },
    []
  );

  const onDownloadErrorEvent = useCallback((progress: event.Event<string>) => {
    if (progress.payload.includes("by user")) return;
    banners.push({
      closable: true,
      colour: "red",
      id: "download_error",
      text: `${progress.payload}`,
      expireAfter: 5,
    });
  }, []);

  const onVerifyEvent = useCallback(
    (progress: event.Event<ManifestVerifyProgress>) => {
      if (!downloadState.allowed_to_verify(progress.payload.manifest_id)) {
        return;
      }

      if (
        progress.payload.checked_files !== progress.payload.total_files &&
        progress.payload.checked_files % 5 !== 0
      ) {
        return;
      }

      downloadState.set_active_verifying_progress(
        progress.payload.manifest_id,
        progress.payload
      );

      console.log(`[verify] ${progress.payload.manifest_id}
        total_files: ${progress.payload.total_files}
        checked_files: ${progress.payload.checked_files}
        current_file: ${progress.payload.current_file}`);
    },
    []
  );

  const onVerifyComplete = useCallback(
    (progress: event.Event<VERIFYING_STATUS>) => {
      downloadState.set_allowed_to_verify(
        progress.payload.manifest_id,
        progress.payload.status
      );

      console.log(
        `[verify] ${progress.payload.manifest_id} with status: ${progress.payload.status}`
      );
    },
    []
  );

  const onEasyAnticheatInitialised = useCallback(
    (progress: event.Event<EAC_INITIALISED>) => {
      console.log("[EAC_INITIALISED] initialised", progress.payload);
      library.setEacInitialisedForBuild(progress.payload.version, true);
    },
    []
  );

  const onActionAfterLaunch = useCallback(
    (progress: event.Event<ManifestProgress>) => {
      console.log("[download] action after launch", progress.payload);
    },
    []
  );

  useEffect(() => {
    console.log("[download] listening for download events");

    const unlistenDownload = event.listen<ManifestProgress>(
      "DOWNLOAD_PROGRESS",
      onDownloadEvent
    );

    const unlistenDownloadError = event.listen<string>(
      "DOWNLOAD_ERROR",
      onDownloadErrorEvent
    );

    const unlistenVerify = event.listen<ManifestVerifyProgress>(
      "VERIFY_PROGRESS",
      onVerifyEvent
    );

    const unlistenVerifyComplete = event.listen<VERIFYING_STATUS>(
      "VERIFYING",
      onVerifyComplete
    );

    const unlistenEACInitialised = event.listen<EAC_INITIALISED>(
      "EAC_INITIALISED",
      onEasyAnticheatInitialised
    );

    const unlistenDownloadErrorAdv = event.listen<DOWNLOAD_ERROR>(
      "DOWNLOAD_ERROR2",
      onDownloadErrorAdvancedEvent
    );

    return () => {
      unlistenDownload.then((fn: event.UnlistenFn) => fn());
      unlistenDownloadError.then((fn: event.UnlistenFn) => fn());
      unlistenVerify.then((fn: event.UnlistenFn) => fn());
      unlistenVerifyComplete.then((fn: event.UnlistenFn) => fn());
      unlistenEACInitialised.then((fn: event.UnlistenFn) => fn());
      unlistenDownloadErrorAdv.then((fn: event.UnlistenFn) => fn());
    };
  }, [
    onDownloadEvent,
    onVerifyEvent,
    onVerifyComplete,
    onEasyAnticheatInitialised,
    onActionAfterLaunch,
    onDownloadErrorEvent,
  ]);

  const autoDownload = useCallback(async () => {
    if (!user.access()) return;
    if (retrac.stop_auto_download_due_to_error)
      return console.error("Auto download stopped due to previous error");
    if (retrac.do_not_download_paks) return;
    if (!options.auto_download) return console.log("Auto download is disabled");

    const retracBuild = library.library.find(
      (x) => x.version === "++Fortnite+Release-14.40-CL-14550713"
    );
    if (!retracBuild) return console.error("Retrac build not found in library");

    console.log(
      "[download] auto downloading extra content",
      retrac.auto_download_manifests
    );

    for (const manifest of retrac.auto_download_manifests) {
      const result = await invoke.download_build(
        manifest,
        retracBuild.rootLocation
      );
      if (result === null || result === false) {
        console.error(`[download] auto download failed for ${manifest}`);
        return;
      }
    }
  }, [options.auto_download, retrac.auto_download_manifests]);

  const deleteBubbleBuilds = useCallback(async () => {
    console.log("[download] deleting bubble builds");

    const retracBuild = library.library.find(
      (x) => x.version === "++Fortnite+Release-14.40-CL-14550713"
    );
    if (!retracBuild) return console.error("Retrac build not found in library");

    const result = await invoke.delete_build(
      "Bubble_Builds",
      retracBuild.rootLocation
    );
    if (result === null) {
      console.error("[download] failed to delete bubble builds");
      return;
    }
  }, [library.library]);

  useEffect(() => {
    const exists = retrac.auto_download_manifests.some(
      (manifest) => manifest === "Bubble_Builds"
    );

    retrac.set_auto_download_manifests(
      !options.bubble_builds_enabled
        ? exists
          ? retrac.auto_download_manifests.filter((m) => m !== "Bubble_Builds")
          : retrac.auto_download_manifests
        : exists
        ? retrac.auto_download_manifests
        : [...retrac.auto_download_manifests, "Bubble_Builds"]
    );

    if (!options.bubble_builds_enabled) deleteBubbleBuilds();
  }, [options.bubble_builds_enabled]);

  useEffect(() => {
    setTimeout(() => options.auto_download && autoDownload(), 2000);

    const interval = setInterval(() => autoDownload(), 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, [options.auto_download, autoDownload]);

  const onSocketWelcome = async (e: SocketDownEventDataFromType<"welcome">) => {
    console.log("[launch] received welcome event from socket", e);

    const action = await invoke.get_app_action();
    if (action === null || action === "")
      return console.log("[launch] no action to perform");

    const [type, param] = action.split(":");
    console.log(`[launch] performing action: ${type} with param: ${param}`);

    switch (type) {
      case "launch_build":
        if (!param)
          return console.error("[launch] no param provided for launch");

        const result = await library.launchBuild(param);
        if (result === null) {
          console.error("[launch] failed to launch build");
          return;
        }

        console.log(`[launch] launched build: ${param}`);

        break;
      default:
        console.error(`[launch] unknown action type: ${type}`);
    }
  };

  useEffect(() => {
    socket.bind("welcome", onSocketWelcome);

    return () => {
      socket.unbind("welcome", onSocketWelcome);
    };
  }, [socket._socket]);

  return null;
};

export default TauriListeners;
