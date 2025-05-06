import { useDownloadState } from "src/wrapper/download";
import invoke from "src/tauri";
import { formatTime } from "src/helpers/time";

import { OptionGroup } from "src/components/routes/app/settings/option";
import { motion } from "motion/react";
import { SparkLineChart } from "@mui/x-charts";
import UI from "src/components/core/default";

const DownloadsPage = () => {
  const downloadState = useDownloadState();

  const handleStartDownload = async () => {
    const result = await invoke.download_build(
      "++Fortnite+Release-1.8-CL-3724489-Windows",
      "C:\\Users\\User\\Desktop\\New folder\\asd"
    );
    console.log(result);
  };

  return (
    <>
      <OptionGroup _first>
        <div className="flex flex-col gap-[0.2rem]">
          <UI.H1 className="font-[300] text-neutral-300">Downloads</UI.H1>
          <UI.P className="text-neutral-400">
            Find and download new build here hosted from our servers. You can
            also verify and repair your existing builds.
          </UI.P>
        </div>
      </OptionGroup>

      {downloadState.active_progress.size > 0 && (
        <OptionGroup title="Active Downloads">
          {Array.from(downloadState.active_progress.entries()).map(
            ([key, value]) => (
              <DownloadingBuild key={key} progress={value} />
            )
          )}
        </OptionGroup>
      )}

      <OptionGroup title="Available" _last>
        <UI.Button
          onClick={() =>
            invoke.download_build(
              "++Fortnite+Release-1.8-CL-3724489-Windows",
              "C:\\Users\\User\\Desktop\\New folder\\asd"
            )
          }
          colour="invisible"
        >
          download ++Fortnite+Release-1.8-CL-3724489-Windows
        </UI.Button>

        <UI.Button
          onClick={() =>
            invoke.download_build(
              "++Fortnite+Release-14.40-CL-14550713-Windows",
              "C:\\Users\\User\\Desktop\\New folder\\asd2"
            )
          }
          colour="invisible"
        >
          download ++Fortnite+Release-14.40-CL-14550713-Windows
        </UI.Button>
      </OptionGroup>
    </>
  );
};

type DownloadingBuildProps = {
  progress: ManifestProgress;
};

const DownloadingBuild = (props: DownloadingBuildProps) => {
  const get_timed_metabytes = useDownloadState((s) => s.get_timed_metabytes);

  return (
    <div className="relative rounded-sm overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-max flex flex-col gap-0.5 p-2.5 z-50">
        <UI.H1 className="font-[300] text-neutral-300">
          {props.progress.manifest_id}
        </UI.H1>
        <div className="flex flex-row flex-wrap items-center mr-[15.5rem] gap-0 leading-0">
          <UI.P className="text-neutral-500 text-xs">
            {props.progress.current_file}
          </UI.P>
          <s className="ml-auto" />
          <UI.P className="text-neutral-500 text-xs">
            {formatTime(props.progress.eta_seconds * 1000, 999, true, false)}{" "}
            Remaining at {props.progress.speed_mbps.toFixed(2)} MB/s
          </UI.P>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full border-[#2e2e2e80] border-[1px] border-solid rounded-sm"></div>
      <motion.div
        className="absolute top-0 left-0 h-full z-10 border-blue-400/10 rounded-md bg-gradient-to-r from-30% to-transparent from-indigo-500/10"
        // style={{ width: `${props.progress.percent * 100}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${props.progress.percent}%` }}
        transition={{ type: "spring", stiffness: 200, damping: 19 }}
      ></motion.div>

      <div className="absolute flex flex-row bottom-2 right-2 h-10 overflow-hidden rounded-sm w-60 bg-green-400/10 border-green-400/10 border-[1px] border-solid z-30 backdrop-blur-lg">
        <SparkLineChart
          data={[...get_timed_metabytes(props.progress.manifest_id)]}
          curve="natural"
          color="#05df7278"
          yAxis={{
            domainLimit: (_) => {
              return {
                min: 0,
                max:
                  Math.max(...get_timed_metabytes(props.progress.manifest_id)) *
                  1.2,
              };
            },
          }}
        />
      </div>

      <div className="min-h-max pointer-events-none flex flex-col gap-0 p-2.5 z-50 opacity-0">
        <UI.H1 className="font-[300] text-neutral-300">
          {props.progress.manifest_id}
        </UI.H1>
        <div className="flex flex-row flex-wrap items-center mr-[15.5rem] gap-1">
          <UI.P className="text-neutral-500 text-xs">
            {props.progress.current_file}
          </UI.P>
          <s className="ml-auto" />
          <UI.P className="text-neutral-500 text-xs">
            {formatTime(props.progress.eta_seconds * 1000, 999, true, false)}{" "}
            Remaining
          </UI.P>
          <UI.P className="text-neutral-500 text-xs">
            at {props.progress.speed_mbps.toFixed(2)} MB/s
          </UI.P>
        </div>
      </div>
    </div>
  );
};

export default DownloadsPage;
