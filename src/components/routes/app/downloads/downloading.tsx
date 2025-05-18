import { useDownloadState } from "src/wrapper/download";
import { useOptions } from "src/wrapper/options";
import { formatTime } from "src/helpers/time";
import {
  BUILD_NICE_NAMES,
  DOWNLOAD_FILE_NICE_NAMES,
} from "src/wrapper/library";

import UI from "src/components/core/default";
import { SparkLineChart } from "@mui/x-charts";
import { motion } from "motion/react";

type DownloadingBuildProps = {
  progress: ManifestProgress;
};

const DownloadingBuildUI = (props: DownloadingBuildProps) => {
  const options = useOptions();

  return (
    <>
      <UI.H1 className="font-[300] text-neutral-300">
        {BUILD_NICE_NAMES[
          props.progress.manifest_id.replace("-Windows", "")
        ] ? (
          <div className="flex flex-row items-center">
            {
              BUILD_NICE_NAMES[
                props.progress.manifest_id.replace("-Windows", "")
              ]
            }
            <span className="ml-1 mt-[5px] text-[11px] font-medium text-neutral-500">
              {props.progress.manifest_id
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
                .join(" ")}
            </span>
          </div>
        ) : DOWNLOAD_FILE_NICE_NAMES[props.progress.manifest_id] ? (
          DOWNLOAD_FILE_NICE_NAMES[props.progress.manifest_id]
        ) : (
          props.progress.manifest_id.replace("-Windows", "")
        )}
      </UI.H1>

      <div className="flex flex-col justify-center mr-[15.5rem] gap-0 leading-0">
        <s className="ml-auto" />
        <UI.P className="text-neutral-500 text-xs">
          {props.progress.eta_seconds < 30
            ? "Less than a minute"
            : formatTime(
                props.progress.eta_seconds * 1000,
                3,
                false,
                false
              )}{" "}
          remaining
          {" • "}
          {props.progress.current_files.length} file
          {props.progress.current_files.length === 1 ? "" : "s"} currently
          downloading
        </UI.P>

        {options.advanced_download_view && (
          <div className="flex flex-row items-center gap-1">
            <UI.P className="text-neutral-500 text-xs">
              {(props.progress.downloaded_bytes / 1024 / 1024 / 1024).toFixed(
                2
              )}{" "}
              GB of{" "}
              {(props.progress.total_bytes / 1024 / 1024 / 1024).toFixed(2)} GB
            </UI.P>
            <s className="ml-auto" />
          </div>
        )}
      </div>

      <div className="w-full h-1 mt-1 mb-1 rounded-3xl bg-red-50/10 overflow-hidden">
        <motion.div
          className="h-full bg-blue-400/50 backdrop-blur-lg rounded-2xl"
          initial={{ width: 0 }}
          animate={{ width: `${props.progress.percent}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 19 }}
        ></motion.div>
      </div>
    </>
  );
};

const DownloadingBuild = (props: DownloadingBuildProps) => {
  const options = useOptions();

  const get_timed_metabytes = useDownloadState((s) => s.get_timed_metabytes);

  return (
    <div className="relative rounded-sm overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-max flex flex-col gap-0.5 p-2.5 z-50">
        <DownloadingBuildUI progress={props.progress} />
      </div>

      <div className="absolute top-0 left-0 w-full h-full border-[#2e2e2e80] border-[1px] border-solid rounded-sm"></div>

      <motion.div
        className="absolute top-0 left-0 h-full z-10 border-blue-400/10 rounded-md bg-gradient-to-r from-30% to-transparent from-indigo-500/10"
        initial={{ width: 0 }}
        animate={{ width: `${props.progress.percent}%` }}
        transition={{ type: "spring", stiffness: 200, damping: 19 }}
      ></motion.div>

      {options.advanced_download_view && (
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
      )}

      <div className="min-h-max pointer-events-none flex flex-col gap-0 p-2.5 z-50 opacity-0">
        <DownloadingBuildUI progress={props.progress} />
      </div>
    </div>
  );
};
export default DownloadingBuild;
