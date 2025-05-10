import { useEffect } from "react";
import { useDownloadState } from "src/wrapper/download";
import { event } from "@tauri-apps/api";

const DownloadListener = () => {
  const downloadState = useDownloadState();

  const onDownloadEvent = (progress: event.Event<ManifestProgress>) => {
    downloadState.set_active_download_progress(
      progress.payload.manifest_id,
      progress.payload
    );

    downloadState.add_timed_metabytes(
      progress.payload.manifest_id,
      new Date(),
      progress.payload.speed_mbps
    );

    console.log(
      `[download] ${progress.payload.manifest_id} 
        progress: ${progress.payload.percent}%
        file len:${progress.payload.current_files.length}
        downloaded_bytes: ${progress.payload.downloaded_bytes}
        total_bytes: ${progress.payload.total_bytes}
        speed_mbps: ${progress.payload.speed_mbps}
        eta_seconds: ${progress.payload.eta_seconds}
      `
    );
  };

  const onVerifyEvent = (progress: event.Event<MannifestVerifyProgress>) => {
    downloadState.set_active_verifying_progress(
      progress.payload.manifest_id,
      progress.payload
    );

    console.log(
      `[verify] ${progress.payload.manifest_id} 
        verify progress: ${
          (progress.payload.checked_files / progress.payload.total_files) * 100
        }%
        checked_files: ${progress.payload.checked_files}
        total_files: ${progress.payload.total_files}
        current_file: ${progress.payload.current_file}
      `
    );
  };

  useEffect(() => {
    console.log("[download] listening for download events");

    const unlistenDownload = event.listen<ManifestProgress>(
      "DOWNLOAD_PROGRESS",
      onDownloadEvent
    );

    const unlistenVerify = event.listen<MannifestVerifyProgress>(
      "VERIFY_PROGRESS",
      onVerifyEvent
    );

    return () => {
      unlistenDownload.then((fn: event.UnlistenFn) => fn());
      unlistenVerify.then((fn: event.UnlistenFn) => fn());
    };
  }, []);

  return null;
};

export default DownloadListener;
