import { LAUNCH_STATE, useLibrary } from "src/wrapper/library";
import { convertFileSrc } from "@tauri-apps/api/core";
import invoke from "src/tauri";

import {
  IoBuild,
  IoClose,
  IoCopy,
  IoPlay,
  IoShield,
  IoTrashBin,
} from "react-icons/io5";
import { motion } from "motion/react";
import { useBannerManager } from "src/wrapper/banner";

type FortniteBuildProps = {
  entry: LibraryEntry;
};

const FortniteBuildList = (props: FortniteBuildProps) => {
  const library = useLibrary();
  const banners = useBannerManager();

  const handleClose = async () => {
    library.setLaunchState(LAUNCH_STATE.CLOSING);
    await invoke.close_fortnite();

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

  const deleteBuild = async () => {
    if (library.launchState === LAUNCH_STATE.LAUNCHED) {
      library.setLaunchState(LAUNCH_STATE.CLOSING);
      await invoke.close_fortnite();
    }
    await library.removeLibraryEntry(props.entry.version);
  };

  const closeBuild = async () => {
    if (library.launchState === LAUNCH_STATE.LAUNCHED) {
      library.setLaunchState(LAUNCH_STATE.CLOSING);
      await invoke.close_fortnite();
      setTimeout(() => {
        library.setLaunchedBuild(null);
        library.setLaunchState(LAUNCH_STATE.NONE);
      }, 5000);
    }
  };

  const addToDefender = async () => {
    const result = await invoke.add_to_defender(props.entry.rootLocation);
    if (result === null) {
      throw new Error("Failed to add to Windows Defender");
    }

    library.updateLibraryEntry(props.entry.version, {
      addedToWindowsDefender: true,
    });

    banners.push({
      id: "added_to_defender",
      text: "Added to Windows Defender",
      colour: "blue",
      closable: true,
      expireAfter: 3,
    });
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
      className={`group relative flex flex-row items-center w-full p-2.5 px-2 gap-2 rounded-sm border-neutral-700/40 border-[1px] border-solid overflow-hidden hover:bg-neutral-700/5 transition-colors duration-75 ${""}`}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.1 } }}
      transition={{ type: "spring", stiffness: 200, damping: 19 }}
    >
      <div className="relative h-11 aspect-square min-w-max min-h-9 flex items-center justify-center bg-neutral-700/20 rounded-md overflow-hidden">
        <img
          src={convertFileSrc(props.entry.splashLocation)}
          className="aboslute w-full"
        />
      </div>

      <div className="flex flex-col w-full h-full justify-center gap-[0.05rem]">
        <p className="font-semibold text-md text-neutral-300 leading-4">
          {props.entry.buildName}

          {launchedBuildIsCurrent && (
            <span className="text-green-400/80 text-xs"> Launched</span>
          )}
        </p>
        <p className="flex flex-row gap-1 items-center text-sm leading-4 text-neutral-400">
          {props.entry.version}
        </p>
      </div>

      <div className="flex flex-row items-center gap-2 ml-auto px-1">
        {!props.entry.addedToWindowsDefender && (
          <button
            className="aspect-square min-w-max h-8 flex items-center justify-center p-1.5 bg-neutral-700/20 rounded-md cursor-pointer hover:bg-blue-400/30 transition-all text-neutral-500 hover:text-blue-200"
            onClick={addToDefender}
          >
            <IoShield className="w-full h-full" />
          </button>
        )}

        {launchedBuildIsCurrent ? (
          <button
            className="aspect-square min-w-max h-8 flex items-center justify-center p-1.5 bg-neutral-700/20 rounded-md cursor-pointer hover:bg-red-400/30 transition-all text-neutral-500 hover:text-red-200"
            onClick={closeBuild}
          >
            <IoClose className="w-full h-full" />
          </button>
        ) : (
          <button
            className="aspect-square min-w-max h-8 flex items-center justify-center p-1.5 bg-neutral-700/20 rounded-md cursor-pointer hover:bg-green-400/30 transition-all text-neutral-500 hover:text-green-200"
            onClick={primaryhandler}
          >
            <IoPlay className="w-full h-full" />
          </button>
        )}
        <button
          className="aspect-square min-w-max h-8 flex items-center justify-center p-1.5 bg-neutral-700/20 rounded-md cursor-pointer hover:bg-red-400/30 transition-all text-neutral-500 hover:text-red-200"
          onClick={deleteBuild}
        >
          <IoTrashBin className="w-full h-full" />
        </button>
      </div>
    </motion.div>
  );
};

export default FortniteBuildList;
