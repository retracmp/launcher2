import { useOptions } from "src/wrapper/options";
import { useCallback, useEffect } from "react";
import { useDownloadState } from "src/wrapper/download";
import { useRetrac } from "src/wrapper/retrac";
import { event } from "@tauri-apps/api";
import invoke from "src/tauri";
import { useLibrary } from "src/wrapper/library";
import { useUserManager } from "src/wrapper/user";

const DownloadListener = () => {
  const downloadState = useDownloadState();
  const options = useOptions();
  const user = useUserManager();
  const library = useLibrary();
  const retrac = useRetrac();

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

  useEffect(() => {
    console.log("[download] listening for download events");

    const unlistenDownload = event.listen<ManifestProgress>(
      "DOWNLOAD_PROGRESS",
      onDownloadEvent
    );

    const unlistenVerify = event.listen<ManifestVerifyProgress>(
      "VERIFY_PROGRESS",
      onVerifyEvent
    );

    const unlistenVerifyComplete = event.listen<VERIFYING_STATUS>(
      "VERIFYING",
      onVerifyComplete
    );

    return () => {
      unlistenDownload.then((fn: event.UnlistenFn) => fn());
      unlistenVerify.then((fn: event.UnlistenFn) => fn());
      unlistenVerifyComplete.then((fn: event.UnlistenFn) => fn());
    };
  }, [onDownloadEvent, onVerifyEvent, onVerifyComplete]);

  const autoDownload = useCallback(async () => {
    if (!user.access()) return;
    if (downloadState.active_download_progress.size > 0) return;
    if (!options.auto_download) return console.log("Auto download is disabled");

    const retracBuild = library.library.find(
      (x) => x.version === "++Fortnite+Release-14.40-CL-14550713"
    );
    if (!retracBuild) return console.error("Retrac build not found in library");

    console.log("[download] auto downloading extra content");

    for (const manifest of retrac.auto_download_manifests) {
      const result = await invoke.download_build(
        manifest,
        retracBuild.rootLocation
      );
      if (result === null)
        return console.error("Failed to download extra content");
    }
  }, [
    options.auto_download,
    retrac.auto_download_manifests,
    downloadState.active_download_progress,
  ]);

  useEffect(() => {
    setTimeout(() => options.auto_download && autoDownload(), 2000);

    const interval = setInterval(() => autoDownload(), 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, [options.auto_download, autoDownload]);

  return null;
};

export default DownloadListener;
