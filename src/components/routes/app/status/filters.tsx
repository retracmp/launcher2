import { useEffect, useRef } from "react";
import { useRetrac } from "src/wrapper/retrac";
import { useServerManager } from "src/wrapper/server";

import { motion, AnimatePresence } from "motion/react";
import { BooleanOption } from "../settings/option";
import { HiX } from "react-icons/hi";
import UI from "src/components/core/default";

const FiltersWidget = () => {
  const servers = useServerManager();

  return (
    <div className="flex flex-col gap-1.5 w-full overflow-hidden">
      <UI.P>
        <span className="font-[500] font-geist">Server List Filters</span>
      </UI.P>
      <div className="flex flex-col gap-1 overflow-auto w-full">
        <BooleanOption
          title="Europe Servers"
          description="Show European servers in the server list."
          type={servers.show_eu_servers}
          set={servers.set_show_eu_servers}
        />
        <BooleanOption
          title="North America Servers"
          description="Show North American servers in the server list."
          type={servers.show_na_servers}
          set={servers.set_show_na_servers}
        />
      </div>
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
            className="relative flex flex-col p-2 gap-2 min-w-96 w-[40%] max-h-[80%] bg-neutral-900 border-neutral-800 border-1 border-solid shadow-neutral-900/30 shadow-lg rounded-sm"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 19 }}
          >
            <FiltersWidget />
            <HiX
              className="absolute right-1.5 top-1.5 text-neutral-500 hover:text-neutral-300 cursor-pointer"
              onClick={() => retrac.set_show_filters(false)}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FiltersParent;
