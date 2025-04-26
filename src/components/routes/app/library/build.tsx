import { convertFileSrc } from "@tauri-apps/api/core";
import { LAUNCH_STATE, useLibrary } from "src/wrapper/library";
import invoke from "src/invoke";

import { motion } from "motion/react";

type FortniteBuildProps = {
  entry: LibraryEntry;
};

const FortniteBuild = (props: FortniteBuildProps) => {
  const library = useLibrary();

  const test = async () => {
    const version = await invoke.get_fortnite_version(
      props.entry.processLocation
    );
    console.log(version, library.launchState);
    library.setLaunchState(LAUNCH_STATE.LAUNCHING);
  };

  return (
    <motion.div
      className={`group relative flex items-center justify-center aspect-[9/11] w-36 max-w-36 rounded-sm border-[#2e2e2e] border-[1px] border-solid overflow-hidden ${
        library.launchState === LAUNCH_STATE.NONE
          ? "cursor-pointer"
          : "cursor-not-allowed"
      }`}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ type: "spring", stiffness: 200, damping: 19 }}
      whileHover={library.launchState === LAUNCH_STATE.NONE ? { y: -2 } : {}}
      onClick={test}
    >
      <img
        className={`absolute w-[110%] h-[110%] rounded-sm object-cover blur-[0.03rem] ${
          library.launchState === LAUNCH_STATE.NONE
            ? "opacity-70"
            : "opacity-30"
        } ${
          library.launchState === LAUNCH_STATE.NONE && "group-hover:opacity-100"
        } pointer-events-none transition-opacity duration-300`}
        src={convertFileSrc(props.entry.splashLocation)}
      />
    </motion.div>
  );
};

export default FortniteBuild;
