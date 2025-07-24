import { useEffect, useRef } from "react";
import { useRetrac } from "src/wrapper/retrac";
import { useServerManager } from "src/wrapper/server";

import { motion, AnimatePresence } from "motion/react";
import { BooleanOption, OptionGroup } from "../../../core/option";
import { HiX } from "react-icons/hi";
import UI from "src/components/core/default";

const FiltersWidget = () => {
  const servers = useServerManager();

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* <UI.P>
        <span className="font-[700] text-md uppercase">
          Server List Filters
        </span>
      </UI.P> */}
      <OptionGroup _first>
        <div className="flex flex-col gap-[0.2rem] p-1.5 pb-0">
          <UI.H1 className="font-[300] text-neutral-300">Server Filters</UI.H1>
          <UI.P className="text-neutral-400">
            Filter the server list by a specific region.
          </UI.P>
        </div>
      </OptionGroup>
      <OptionGroup _last _first _hideBorder>
        <BooleanOption
          title="Gravelines, France Servers"
          description={
            <>
              Show France <b>EU</b> servers in the server list.
            </>
          }
          state={servers.show_eu_servers}
          set={servers.set_show_eu_servers}
        />
        <BooleanOption
          title="Virginia Servers"
          description={
            <>
              Show Virginia <b>NA</b> servers in the server list.
            </>
          }
          state={servers.show_na_servers}
          set={servers.set_show_na_servers}
        />

        <BooleanOption
          title="Los Angeles Servers"
          description={
            <>
              Show Los Angeles <b>NAW</b> servers in the server list.
            </>
          }
          state={servers.show_naw_servers}
          set={servers.set_show_naw_servers}
        />

        <BooleanOption
          title="Sydney Servers"
          description={
            <>
              Show Sydney <b>OCE</b> servers in the server list.
            </>
          }
          state={servers.show_oce_servers}
          set={servers.set_show_oce_servers}
        />
      </OptionGroup>
    </div>
  );
};

const FiltersParent = () => {
  const retrac = useRetrac();

  const widgetContainerReference = useRef<HTMLDivElement>(null);
  const widgetReference = useRef<HTMLDivElement>(null);

  const widgetContainerClicked = (e: MouseEvent) => {
    if (!widgetReference.current)
      return console.error("widgetReference is null");
    if (!widgetContainerReference.current)
      return console.error("widgetContainerReference is null");

    if (widgetReference.current.contains(e.target as Node)) return;

    retrac.set_show_filters(false);
  };

  useEffect(() => {
    if (!widgetContainerReference.current)
      return console.error("widgetContainerReference is null");

    widgetContainerReference.current.addEventListener(
      "click",
      widgetContainerClicked
    );

    return () => {
      if (!widgetContainerReference.current)
        return console.error("widgetContainerReference is null");

      widgetContainerReference.current.removeEventListener(
        "click",
        widgetContainerClicked
      );
    };
  }, [retrac.show_filters, widgetContainerReference, widgetReference]);

  return (
    <AnimatePresence key="filters-parent">
      {retrac.show_filters && (
        <motion.div
          ref={widgetContainerReference}
          className="fixed flex flex-col items-center justify-center w-full h-full top-0 left-0 bg-neutral-950/50 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key="shiw-filters"
          style={retrac.show_filters ? {} : { pointerEvents: "none" }}
          transition={{ duration: 0.075, type: "tween" }}
        >
          <div
            className="absolute w-full h-8 top-0 left-0"
            data-tauri-drag-region
          ></div>
          <motion.div
            ref={widgetReference}
            className="relative flex flex-col min-w-96 w-[40%] max-h-[80%] bg-neutral-900 border-neutral-800 border-1 border-solid shadow-neutral-900/30 shadow-lg rounded-md"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 19 }}
          >
            <FiltersWidget />
            <HiX
              className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-300 cursor-pointer"
              onClick={() => retrac.set_show_filters(false)}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FiltersParent;
