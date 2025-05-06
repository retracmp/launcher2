import { useEffect } from "react";
import { useDownloadState } from "src/wrapper/download";
import { event } from "@tauri-apps/api";

const DownloadListener = () => {
  const downloadState = useDownloadState();

  useEffect(() => {
    console.log("[download] listening for download events");

    const unlisten = event.listen<ManifestProgress>(
      "DOWNLOAD_PROGRESS",
      (progress) => {
        {
          downloadState.set_active_progress(
            progress.payload.manifest_id,
            progress.payload
          );

          downloadState.add_timed_metabytes(
            progress.payload.manifest_id,
            new Date(),
            progress.payload.speed_mbps
          );

          console.log(
            `[download] ${progress.payload.manifest_id} file:${progress.payload.current_file} progress: ${progress.payload.percent}%`
          );
        }
      }
    );

    return () => {
      unlisten.then((fn: event.UnlistenFn) => fn());
    };
  }, []);

  return null;
};

export default DownloadListener;
