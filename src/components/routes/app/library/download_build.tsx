import { useDownloadState } from "src/wrapper/download";
import { useLibrary } from "src/wrapper/library";
import { useOptions } from "src/wrapper/options";
import { open } from "@tauri-apps/plugin-dialog";

import {
  IoBuildSharp,
  IoDownload,
  IoPlay,
  IoSearchSharp,
  IoStop,
} from "react-icons/io5";
import { motion } from "motion/react";
import UI from "src/components/core/default";
import invoke from "src/tauri";

type InstalledBuildProps = {
  entry: ManifestInformation;
};

const DownloadBuild = (props: InstalledBuildProps) => {
  const downloads = useDownloadState();
  const library = useLibrary();
  const options = useOptions();

  const alreadyDownloaded = library.library.find(
    (x) => x.version === props.entry.manifestId.replace("-Windows", "")
  );

  const downloadingProgress = downloads.active_download_progress.get(
    props.entry.manifestId
  );
  const currentlyDownloading = downloadingProgress != undefined;

  const verifyingState = downloads.active_verifying_progress.get(
    props.entry.manifestId
  );
  const currentlyVerifying = downloads.allowed_to_verify(
    props.entry.manifestId
  );

  const handleDownload = async () => {
    const existingEntry = library.library.find(
      (x) => x.version === props.entry.manifestId.replace("-Windows", "")
    );
    if (existingEntry) {
      await invoke.download_build(
        props.entry.manifestId,
        existingEntry.rootLocation
      );
      return;
    }

    const result = await invoke.download_build(
      props.entry.manifestId,
      `${options.content_directory}/${props.entry.manifestId}`
    );
    if (result === null || result === false) return;

    const entry = await library.createLibraryEntry(
      `${options.content_directory}/${props.entry.manifestId}`
    );

    console.log(result, entry);
  };

  const handleFindLocation = async () => {
    const selectedPath = await open({ directory: true, multiple: false });
    if (!selectedPath) return;

    if (Array.isArray(selectedPath)) {
      return library.createLibraryEntry(selectedPath[0]);
    }

    return library.createLibraryEntry(selectedPath);
  };

  return (
    <motion.div
      className={`group flex flex-row items-center w-full p-2.5 px-2 gap-2 rounded-sm border-neutral-700/10 border-[1px] border-solid bg-neutral-700/10 hover:bg-neutral-700/15 transition-colors hover:duration-[20ms] duration-150 backdrop-blur-md z-[200]`}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -20, transition: { duration: 0.1 } }}
      transition={{ type: "spring", stiffness: 200, damping: 19 }}
    >
      <div className="relative h-11 aspect-square min-w-max min-h-9 flex items-center justify-center bg-neutral-700/20 rounded-md overflow-hidden">
        <img
          src={props.entry.iconUrl}
          className="aboslute w-full select-none"
          draggable={false}
        />
      </div>

      <div className="flex flex-col w-full h-full justify-center gap-[0.05rem]">
        <p
          className={`flex flex-row items-center gap-1 font-semibold text-md text-neutral-300 leading-4 transition-colors duration-75`}
        >
          {props.entry.title}
        </p>
        <p
          className={`flex flex-row gap-1 items-center text-sm leading-4 text-neutral-400 transition-colors duration-75`}
        >
          {props.entry.manifestId}
        </p>
      </div>

      <div className="flex flex-row items-center gap-2 ml-auto px-1">
        {alreadyDownloaded && (
          <>
            <UI.RowButton
              colour="green"
              tooltip="Launch Build"
              on_click={() => null}
            >
              <IoPlay className="w-full h-full" />
            </UI.RowButton>

            <UI.RowButton
              colour="blue"
              on_click={handleDownload}
              tooltip="View Options"
              _last
            >
              <IoBuildSharp className="w-full h-full" />
            </UI.RowButton>
          </>
        )}

        {!alreadyDownloaded && (
          <>
            {!currentlyDownloading && (
              <>
                <UI.RowButton
                  colour="blue"
                  on_click={handleFindLocation}
                  tooltip="Locate Folder"
                >
                  <IoSearchSharp className="w-full h-full" />
                </UI.RowButton>

                <UI.RowButton
                  colour="blue"
                  on_click={handleDownload}
                  tooltip="Download & Install"
                  disabled={currentlyDownloading}
                  _last
                >
                  <IoDownload className="w-full h-full" />
                </UI.RowButton>
              </>
            )}

            {currentlyDownloading && (
              <UI.RowButton
                colour="red"
                on_click={handleDownload}
                tooltip="Cancel Download"
                disabled={!currentlyDownloading}
                _last
              >
                <IoStop className="w-full h-full" />
              </UI.RowButton>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default DownloadBuild;
