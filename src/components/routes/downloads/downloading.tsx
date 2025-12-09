import invoke from "src/tauri/index";

import { motion } from "motion/react";
import {
  BUILD_NICE_NAMES,
  DOWNLOAD_FILE_NICE_NAMES,
} from "src/wrapper/library";
import UI from "src/components/core/default";
import { IoPause, IoPlaySkipForward, IoStop } from "react-icons/io5";
import { formatTime } from "src/helpers/time";

type DownloadingBuildProps = {
  progress: ManifestProgress;
  information?: ManifestInformation;
};

const DownloadingBuildUI = (props: DownloadingBuildProps) => {
  const handleCancel = async () => {
    await invoke.cancel_download(props.progress.manifest_id);
  };

  const handlePause = async () => {
    await invoke.pause_download(props.progress.manifest_id);
  };

  const handleResume = async () => {
    await invoke.resume_download(props.progress.manifest_id);
  };

  console.log(props.information, props.progress.manifest_id);

  return (
    <motion.div
      className={`group flex flex-row items-center w-full gap-2 rounded-sm z-[200]`}
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
          src={props.information?.iconUrl}
          className="aboslute w-full select-none"
          draggable={false}
        />
      </div>

      <div className="flex flex-col w-full h-full justify-center gap-0.5">
        <p
          className={`flex flex-row items-center gap-1 font-semibold text-md text-neutral-300 leading-5 transition-colors duration-75`}
        >
          {BUILD_NICE_NAMES[props.progress.manifest_id.replace("-Windows", "")]
            ? props.progress.manifest_id
                .replace("-Windows", "")
                .replace("++Fortnite+", "")
                .replace("Release", "Fortnite")
                .split("-")
                .map((item, idx) => {
                  if (idx === 2) {
                    return (
                      item + "-" + props.progress.manifest_id.split("-")[3]
                    );
                  }
                  return item;
                })
                .slice(0, 3)
                .join(" ")
            : DOWNLOAD_FILE_NICE_NAMES[props.progress.manifest_id]
            ? DOWNLOAD_FILE_NICE_NAMES[props.progress.manifest_id]
            : props.progress.manifest_id.replace("-Windows", "")}
        </p>

        <div className="flex flex-col w-full h-full justify-center gap-[0.05rem]">
          <div className="w-full h-1.5 bg-neutral-800 rounded-full">
            <motion.div
              className="h-1.5 bg-green-500/20 rounded-full"
              initial={{
                width: `0%`,
              }}
              animate={{
                width: `${props.progress.percent}%`,
              }}
            ></motion.div>
          </div>
        </div>

        <div className="flex flex-row text-xs leading-4 text-neutral-400 transition-colors duration-75 gap-1">
          <p className="text-neutral-300 text-xs leading-4">
            {props.progress.is_paused ? "Paused" : "Downloading"}
          </p>
          {!props.progress.is_paused && (
            <p className="text-neutral-400 text-xs leading-4">
              {props.progress.eta_seconds < 30
                ? "Less than a minute"
                : formatTime(
                    props.progress.eta_seconds * 1000,
                    3,
                    false,
                    false
                  )}{" "}
              remaining
            </p>
          )}
          <p className="ml-auto text-neutral-400 text-xs leading-4">
            {(props.progress.downloaded_bytes / 1024 / 1024 / 1024).toFixed(2)}
            GB of {(props.progress.total_bytes / 1024 / 1024 / 1024).toFixed(2)}
            GB
          </p>
        </div>
      </div>

      <div className="flex flex-row items-center gap-2 ml-auto px-1">
        {!props.progress.is_paused ? (
          <UI.RowButton
            colour="blue"
            on_click={handlePause}
            tooltip="Pause Download"
          >
            <IoPause className="w-full h-full" />
          </UI.RowButton>
        ) : (
          <UI.RowButton
            colour="green"
            on_click={handleResume}
            tooltip="Resume Download"
          >
            <IoPlaySkipForward className="w-full h-full" />
          </UI.RowButton>
        )}
        <UI.RowButton
          colour="red"
          on_click={handleCancel}
          tooltip="Cancel Download"
          _last
        >
          <IoStop className="w-full h-full" />
        </UI.RowButton>
      </div>
    </motion.div>
  );
};

/**      {options.advanced_download_view && (
        <div
          className="absolute flex flex-row top-2 right-2 h-[44px] overflow-hidden rounded-sm w-40 z-30 backdrop-blur-lg"
          style={{
            backgroundImage:
              "linear-gradient(to top, transparent 0%, color-mix(in oklab, oklch(79.2% 0.209 151.711) 10%, transparent) 100%)",
          }}
        >
          <SparkLineChart
            data={[...get_timed_metabytes(props.progress.manifest_id)].splice(
              -80
            )}
            curve="natural"
            color="#05df7278"
            yAxis={{
              domainLimit: (_) => {
                return {
                  min: 0,
                  max:
                    Math.max(
                      ...get_timed_metabytes(props.progress.manifest_id)
                    ) * 1.2,
                };
              },
            }}
          />

          <p className="right-0.5 bottom-0.5 absolute mt-auto text-[11px] text-green-400/50">
            {props.progress.speed_mbps.toFixed(2)} MB/s
          </p>
        </div>
      )} */

const DownloadingBuild = (props: DownloadingBuildProps) => {
  return (
    <motion.div
      className="group flex flex-col items-center w-full p-2.5 px-2 gap-2 rounded-sm border-neutral-700/10 border-[1px] border-solid bg-neutral-700/10 hover:bg-neutral-700/15 transition-colors hover:duration-[20ms] duration-150 backdrop-blur-md z-[200]"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -20, transition: { duration: 0.1 } }}
      transition={{ type: "spring", stiffness: 200, damping: 19 }}
    >
      <DownloadingBuildUI {...props} />
    </motion.div>
  );
};
export default DownloadingBuild;
