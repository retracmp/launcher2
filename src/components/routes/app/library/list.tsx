import { useRetrac } from "src/wrapper/retrac";
import { useState } from "react";
import { useBannerManager } from "src/wrapper/banner";
import { LAUNCH_STATE, useLibrary } from "src/wrapper/library";
import { convertFileSrc } from "@tauri-apps/api/core";
import invoke from "src/tauri";

import { IoClose, IoPlay, IoShield, IoTrashBin } from "react-icons/io5";
import { MdDragIndicator } from "react-icons/md";
import { motion, Reorder, useDragControls } from "motion/react";
import UI from "src/components/core/default";

type FortniteBuildProps = {
  entry: LibraryEntry;
};

const FortniteBuildList = (props: FortniteBuildProps) => {
  const library = useLibrary();
  const retrac = useRetrac();
  const banners = useBannerManager();

  const dragControls = useDragControls();

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
    <Reorder.Item
      value={props.entry}
      id={props.entry.version}
      as="div"
      dragListener={false}
      dragControls={dragControls}
    >
      <motion.div
        className={`group flex flex-row items-center w-full p-2.5 px-2 gap-2 rounded-sm border-neutral-700/40 border-[1px] border-solid overflow-hidden hover:bg-neutral-700/5 transition-colors duration-75 ${""}`}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        exit={{ opacity: 0, x: -20, transition: { duration: 0.1 } }}
        transition={{ type: "spring", stiffness: 200, damping: 19 }}
      >
        {retrac.editing_order_of_library && (
          <div
            className="relative h-11 w-8 min-w-max min-h-9 flex items-center justify-center rounded-md overflow-hidden cursor-grab"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <MdDragIndicator className="h-full w-6 text-neutral-500" />
          </div>
        )}

        <div className="relative h-11 aspect-square min-w-max min-h-9 flex items-center justify-center bg-neutral-700/20 rounded-md overflow-hidden">
          <img
            src={convertFileSrc(props.entry.splashLocation)}
            className="aboslute w-full select-none"
            draggable={false}
          />
        </div>

        <div className="flex flex-col w-full h-full justify-center gap-[0.05rem]">
          <p
            className={`flex flex-row items-center gap-1 font-semibold text-md ${
              library.launchState === LAUNCH_STATE.LAUNCHED &&
              !launchedBuildIsCurrent
                ? "text-neutral-500"
                : "text-neutral-300"
            } leading-4 transition-colors duration-75`}
          >
            {props.entry.buildName}

            {launchedBuildIsCurrent && (
              <span className="text-green-400/80 text-xs"> Launched</span>
            )}

            {launchingBuildIsCurrent && (
              <span className="flex flex-row items-center gap-1 text-neutral-400/80 text-xs">
                Launching <UI.LoadingSpinner />
              </span>
            )}

            {closingBuildIsCurrent && (
              <span className="flex flex-row items-center gap-1 text-neutral-400/80 text-xs">
                Closing <UI.LoadingSpinner />
              </span>
            )}
          </p>
          <p
            className={`flex flex-row gap-1 items-center text-sm leading-4 ${
              library.launchState === LAUNCH_STATE.LAUNCHED &&
              !launchedBuildIsCurrent
                ? "text-neutral-500"
                : "text-neutral-400"
            } transition-colors duration-75`}
          >
            {props.entry.version}
          </p>
        </div>

        <div className="flex flex-row items-center gap-2 ml-auto px-1">
          {!props.entry.addedToWindowsDefender && (
            <Button
              colour="blue"
              on_click={addToDefender}
              tooltip="Add to Windows Defender"
            >
              <IoShield className="w-full h-full" />
            </Button>
          )}

          {launchedBuildIsCurrent ? (
            <Button colour="red" on_click={closeBuild} tooltip="Close Fortnite">
              <IoClose className="w-full h-full" />
            </Button>
          ) : (
            <Button
              colour="green"
              on_click={primaryhandler}
              tooltip="Launch Fortnite"
              disabled={
                (library.launchState === LAUNCH_STATE.LAUNCHING &&
                  !launchingBuildIsCurrent) ||
                (library.launchState === LAUNCH_STATE.LAUNCHED &&
                  !launchedBuildIsCurrent)
              }
            >
              <IoPlay className="w-full h-full" />
            </Button>
          )}

          <Button
            colour="red"
            on_click={deleteBuild}
            tooltip="Remove Build"
            _last
          >
            <IoTrashBin className="w-full h-full" />
          </Button>
        </div>
      </motion.div>
    </Reorder.Item>
  );
};

type ButtonProps = {
  children: React.ReactNode;
  on_click: () => void;
  colour: "green" | "red" | "blue" | "invisible";
  tooltip?: string;
  _last?: boolean;
  disabled?: boolean;
};

const Button = (props: ButtonProps) => {
  const colour = (
    {
      blue: "hover:bg-blue-400/30 text-neutral-600 hover:text-blue-200",
      green: "hover:bg-green-400/30 text-neutral-600 hover:text-green-200",
      red: "hover:bg-red-400/30 text-neutral-600 hover:text-red-200",
      invisible: "hover:bg-neutral-700/10 text-neutral-400",
    } as const
  )[props.colour];

  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      <button
        className={`aspect-square min-w-max h-8 flex items-center justify-center p-1.5 bg-neutral-700/20 rounded-md ${
          props.disabled ? "cursor-not-allowed" : "cursor-pointer"
        } transition-all ${colour}`}
        onClick={props.on_click}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        disabled={props.disabled}
      >
        <motion.div
          className="absolute text-xs text-center pointer-events-none bg-neutral-800 p-0.5 px-1.5 min-w-max rounded-md backdrop-blur-md"
          initial={{ opacity: 0, y: -10, x: !props._last ? 0 : -10 }}
          animate={{
            opacity: showTooltip ? 1 : 0,
            y: showTooltip ? -30 : -20,
            x: !props._last ? 0 : -10,
          }}
        >
          {props.tooltip}
        </motion.div>
        {props.children}
      </button>
    </>
  );
};

export default FortniteBuildList;
