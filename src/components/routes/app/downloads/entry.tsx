import { useLibrary } from "src/wrapper/library";
import { useOptions } from "src/wrapper/options";
import { useDownloadState } from "src/wrapper/download";
import invoke from "src/tauri";

import { AnimatePresence, motion } from "motion/react";
import { IoBuildSharp } from "react-icons/io5";
import UI from "src/components/core/default";

type DownloadEntryProps = {
  manifestInfo: ManifestInformation;
};

const DownloadEntry = (props: DownloadEntryProps) => {
  const options = useOptions();

  const library = useLibrary();
  const alreadyDownloaded = library.library.find(
    (x) => x.version === props.manifestInfo.manifestId.replace("-Windows", "")
  );

  const downloadState = useDownloadState();
  const currentlyDownloading = downloadState.active_download_progress.has(
    props.manifestInfo.manifestId
  );
  const verifyingState = downloadState.active_verifying_progress.get(
    props.manifestInfo.manifestId
  );
  const currentlyVerifying = downloadState.allowed_to_verify(
    props.manifestInfo.manifestId
  );

  const handleDownload = async () => {
    const existingEntry = library.library.find(
      (x) => x.version === props.manifestInfo.manifestId.replace("-Windows", "")
    );
    if (existingEntry) {
      await invoke.download_build(
        props.manifestInfo.manifestId,
        existingEntry.rootLocation
      );
      return;
    }

    const result = await invoke.download_build(
      props.manifestInfo.manifestId,
      `${options.content_directory}/${props.manifestInfo.manifestId}`
    );
    if (result === null) return;

    const entry = await library.createLibraryEntry(
      `${options.content_directory}/${props.manifestInfo.manifestId}`
    );

    console.log(result, entry);
  };

  return (
    <motion.div
      onClick={handleDownload}
      className={`group relative min-h-32 border-[#2e2e2e] border-[1px] border-solid rounded-sm overflow-hidden p-2.5 gap-0.5 ${
        currentlyDownloading ? "cursor-not-allowed" : "cursor-pointer"
      } `}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ type: "spring", stiffness: 200, damping: 19 }}
    >
      <div
        className={`absolute w-full h-full flex flex-row top-0 left-0 blur-[0.03rem] ${
          currentlyDownloading ? "bg-blue-400/[5%]" : "bg-blue-400/[0%]"
        } transition-all duration-100`}
      >
        {
          <img
            src={props.manifestInfo.imageUrl}
            className="ml-auto cover w-96 object-cover"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, black 400%)",
              willChange: "transform",
              transform: "translateZ(0)",
            }}
            loading="lazy"
          />
        }
      </div>

      <div className="absolute top-2 right-2 flex flex-row gap-1">
        {!currentlyDownloading && (
          <div className="bg-neutral-700/00 opacity-0 group-hover:opacity-100 group-hover:bg-neutral-700/70 border-[#2e2e2e00] border-[1px] group-hover:border-[#52525279] border-solid transition-opacity duration-50 rounded-md p-1.5 py-0.5 flex flex-row items-center gap-1">
            <UI.P className="text-[12px] flex flex-row items-center gap-0.5">
              {alreadyDownloaded ? (
                <>
                  <IoBuildSharp />
                  Verify Files
                </>
              ) : (
                "Download Build"
              )}
            </UI.P>
          </div>
        )}

        <UI.MinDuration
          visible={currentlyVerifying && verifyingState != undefined}
          minDuration={1000}
        >
          <motion.div
            className={`bg-neutral-700/40 backdrop-blur-lg border-neutral-700 border-[1px] border-solid transition-opacity duration-50 rounded-md p-1.5 py-0.5 flex flex-row items-center gap-1`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0, transition: { delay: 2 } }}
            key="verifying-state"
            transition={{ type: "spring", stiffness: 200, damping: 19 }}
          >
            <UI.P className="text-[12px] flex flex-row items-center gap-0.5">
              Verifying Content {verifyingState?.checked_files} /{" "}
              {verifyingState?.total_files}
            </UI.P>
          </motion.div>
        </UI.MinDuration>

        <AnimatePresence>
          {alreadyDownloaded && !currentlyDownloading && (
            <motion.div
              className={`bg-green-700/40 backdrop-blur-lg border-green-900 border-[1px] border-solid transition-opacity duration-50 rounded-md p-1.5 py-0.5 flex flex-row items-center gap-1`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0, transition: { delay: 2 } }}
              key="installed-state"
              transition={{ type: "spring", stiffness: 200, damping: 19 }}
            >
              <UI.P className="text-[12px] flex flex-row items-center gap-0.5">
                Installed
              </UI.P>
            </motion.div>
          )}

          {currentlyDownloading && (
            <div className="opacity-80 bg-neutral-800/50 backdrop-blur-lg border-neutral-700 border-[1px] border-solid transition-opacity duration-50 rounded-md p-1.5 py-0.5 flex flex-row items-center gap-1">
              <UI.P className="text-[12px] flex flex-row items-center gap-0.5">
                Currently Downloading
              </UI.P>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div
        className={`w-full h-full top-0 left-0 gap-0.5 flex flex-col z-20 opacity-80 ${
          currentlyDownloading ? "opacity-100" : "group-hover:opacity-100"
        } transition-opacity duration-100`}
      >
        <div
          className="w-16 h-16 aspect-square bg-blue-400 mb-1 rounded-md bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage: `url('${props.manifestInfo.iconUrl}')`,
          }}
        ></div>
        <UI.H1>{props.manifestInfo.title}</UI.H1>
        <UI.P className="text-neutral-400">
          {props.manifestInfo.manifestId}
        </UI.P>
      </div>
    </motion.div>
  );
};

export default DownloadEntry;
