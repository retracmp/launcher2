import { useCallback, useEffect } from "react";
import { useDownloadState } from "src/wrapper/download";
import { event } from "@tauri-apps/api";

const DownloadListener = () => {
  const downloadState = useDownloadState();

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

      console.log(`[download] ${progress.payload.manifest_id}
        downloaded_bytes: ${progress.payload.downloaded_bytes}
        total_bytes: ${progress.payload.total_bytes}
        percent: ${progress.payload.percent * 100}%
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
        progress.payload.checked_files % 1 !== 0
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

      if (!progress.payload.status) {
        downloadState.remove_active_verifying_progress(
          progress.payload.manifest_id
        );
      }

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

  return null;
};

export default DownloadListener;
