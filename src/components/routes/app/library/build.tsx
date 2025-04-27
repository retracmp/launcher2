import { convertFileSrc } from "@tauri-apps/api/core";
import { LAUNCH_STATE, useLibrary } from "src/wrapper/library";

import { motion } from "motion/react";
import UI from "src/components/core/default";
import { IoBanSharp, IoPlay } from "react-icons/io5";

type FortniteBuildProps = {
  entry: LibraryEntry;
};

const FortniteBuild = (props: FortniteBuildProps) => {
  const library = useLibrary();

  const handleClose = async () => {
    library.setLaunchState(LAUNCH_STATE.CLOSING);

    setTimeout(() => {
      library.setLaunchedBuild(null);
      library.setLaunchState(LAUNCH_STATE.NONE);
    }, 5000);
  };

  const primaryhandler = async () => {
    switch (library.launchState) {
      case LAUNCH_STATE.NONE:
        library.launchBuild(props.entry.version);
        break;
      case LAUNCH_STATE.LAUNCHED:
        handleClose();
        break;
      default:
        console.log("Cannot launch or close the game while launching.");
    }
  };

  const launchedBuildIsCurrent =
    library.launchState === LAUNCH_STATE.LAUNCHED &&
    props.entry.buildName === library.launchedBuild?.buildName;
  const launchingBuildIsCurrent =
    library.launchState === LAUNCH_STATE.LAUNCHING &&
    props.entry.buildName === library.launchedBuild?.buildName;
  const closingBuildIsCurrent =
    library.launchState === LAUNCH_STATE.CLOSING &&
    props.entry.buildName === library.launchedBuild?.buildName;

  return (
    <motion.div
      className={`group relative flex items-center justify-center aspect-[9/11] w-40 max-w-40 rounded-sm border-[#2e2e2e] border-[1px] border-solid overflow-hidden ${
        library.launchState === LAUNCH_STATE.NONE || launchedBuildIsCurrent
          ? "cursor-pointer"
          : "cursor-not-allowed"
      }`}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ type: "spring", stiffness: 200, damping: 19 }}
      whileHover={
        library.launchState === LAUNCH_STATE.NONE || launchedBuildIsCurrent
          ? { y: -2 }
          : {}
      }
      onClick={primaryhandler}
    >
      <img
        className={`absolute w-[110%] h-[110%] rounded-sm object-cover blur-[0.03rem] ${
          library.launchState === LAUNCH_STATE.NONE || launchedBuildIsCurrent
            ? "opacity-90"
            : "opacity-30"
        } ${
          library.launchState === LAUNCH_STATE.NONE && "group-hover:opacity-100"
        } pointer-events-none transition-opacity duration-300`}
        src={convertFileSrc(props.entry.splashLocation)}
      />

      {launchedBuildIsCurrent && (
        <div
          className="absolute w-full h-full flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          key={props.entry.buildName + "loading"}
          id="loading"
        >
          <IoBanSharp className="text-neutral-300/60 w-8 h-8" />
        </div>
      )}

      {library.launchState === LAUNCH_STATE.NONE && (
        <div
          className="absolute w-full h-full flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          key={props.entry.buildName + "loading"}
          id="loading"
        >
          <IoPlay className="text-neutral-300/60 w-8 h-8" />
        </div>
      )}

      <div
        className="absolute w-full h-[120%] pb-4 bg-neutral-800/90 flex items-end z-10 pointer-events-none group-hover:bg-neutral-600/90 transition-colors duration-200"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black)",
          maskSize: "100% 100%",
        }}
      >
        <div className="flex flex-row items-center p-1 gap-0.5 w-full">
          <div className="flex flex-col">
            <span className="text-xs leading-[14px] font-semibold text-neutral-400">
              {props.entry.buildName}
            </span>
            <span className="text-[10px] font-[500] text-neutral-500">
              {props.entry.version.replace("++Fortnite+Release-", "")}
            </span>
          </div>

          <motion.span
            className={`ml-auto mt-auto text-xs ${
              closingBuildIsCurrent ? "text-neutral-400" : "text-green-200/80"
            }`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: launchedBuildIsCurrent || closingBuildIsCurrent ? 1 : 0,
              transition: { duration: 0.2 },
            }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            {launchedBuildIsCurrent && "Running"}
            {closingBuildIsCurrent && "Closing"}
          </motion.span>
        </div>

        {(launchingBuildIsCurrent || closingBuildIsCurrent) && (
          <motion.div
            className="absolute w-full h-full flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={props.entry.buildName + "loading"}
            id="loading"
          >
            <UI.LoadingSpinnerOpaque />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FortniteBuild;
