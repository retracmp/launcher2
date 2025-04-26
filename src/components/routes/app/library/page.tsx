import { useLibrary } from "src/wrapper/library";
import { open } from "@tauri-apps/plugin-dialog";

import { OptionGroup } from "src/components/routes/app/settings/option";
import { IoBanSharp, IoFolderOpenSharp, IoHammer } from "react-icons/io5";
import { motion } from "motion/react";
import UI from "src/components/core/default";
import FortniteBuild from "src/components/routes/app/library/build";

const LibraryPage = () => {
  const library = useLibrary();

  const handleFindLocation = async () => {
    const selectedPath = await open({ directory: true, multiple: false });
    if (!selectedPath) return;

    if (Array.isArray(selectedPath)) {
      return library.createLibraryEntry(selectedPath[0]);
    }

    return library.createLibraryEntry(selectedPath);
  };

  return (
    <>
      <OptionGroup _first>
        <div className="flex flex-col gap-[0.2rem]">
          <UI.H1 className="font-[300] text-neutral-300">Library</UI.H1>
          <UI.P className="text-neutral-400">
            Manage installed versions, update content patches and more.
          </UI.P>
        </div>
      </OptionGroup>

      <OptionGroup title="Manage">
        <div className="flex flex-row gap-1">
          <UI.Button
            colour="invisible"
            className="py-0 px-2 mt-auto z-10 w-min gap-0"
            onClick={handleFindLocation}
          >
            <IoFolderOpenSharp className="text-neutral-400 w-4 h-4" />
            <span className="text-neutral-400">Find an existing version</span>
          </UI.Button>

          <UI.Button
            colour="invisible"
            className="py-0 px-2 mt-auto z-10 w-min gap-0"
          >
            <IoHammer className="text-neutral-400 w-4 h-4" />
            <span className="text-neutral-400">Install a new version</span>
          </UI.Button>
        </div>
      </OptionGroup>

      <OptionGroup title="Installed Builds" _last>
        <motion.div
          className="flex flex-row flex-wrap gap-2"
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1 },
          }}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{
            staggerChildren: 0.05,
          }}
        >
          {library.library.map((entry) => (
            <FortniteBuild entry={entry} key={entry.version} />
          ))}

          {library.library.length === 0 && (
            <div className="group flex items-center justify-center gap-1 rounded-sm">
              <IoBanSharp className="text-neutral-500 w-4 h-4" />
              <span className="text-neutral-500 text-sm">
                No builds installed
              </span>
            </div>
          )}
        </motion.div>
      </OptionGroup>
    </>
  );
};

export default LibraryPage;
