import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";

import { motion } from "motion/react";
import RecentMatchesWidget from "./widgets/matches";

const RecentMatchesPage = () => {
  const navigate = useNavigate();

  const widgetContainerReference = useRef<HTMLDivElement>(null);
  const widgetReference = useRef<HTMLDivElement>(null);

  const widgetContainerClicked = (e: MouseEvent) => {
    if (!widgetReference.current)
      return console.error("widgetReference is null");
    if (!widgetContainerReference.current)
      return console.error("widgetContainerReference is null");

    if (widgetReference.current.contains(e.target as Node)) return;

    navigate({ to: "/app" });
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
  }, [widgetContainerReference, widgetReference]);

  return (
    <motion.div
      ref={widgetContainerReference}
      className="absolute flex flex-col items-center justify-center w-full h-full top-0 left-0 bg-neutral-950/50 z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key="recent-matches"
      transition={{ duration: 0.075, type: "tween" }}
    >
      <motion.div
        ref={widgetReference}
        className="flex flex-col p-2 gap-2 min-w-96 w-[60%] max-h-[80%] bg-[#1c1c1c] rounded-xs border-[#2e2e2e] border-1 border-solid shadow-neutral-900/30 shadow-lg"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.075, type: "tween" }}
      >
        <RecentMatchesWidget />
      </motion.div>
    </motion.div>
  );
};

export default RecentMatchesPage;
