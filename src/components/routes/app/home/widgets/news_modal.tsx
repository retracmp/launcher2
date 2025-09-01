import { useEffect, useRef } from "react";
import { useRetrac } from "src/wrapper/retrac";

import { AnimatePresence, motion } from "motion/react";
import { HiX } from "react-icons/hi";
import UI from "src/components/core/default";
import { OptionGroup } from "src/components/core/option";
import ReactMarkdown from "react-markdown";

const NewsModalWidget = () => {
  const retrac = useRetrac();

  const newsItem = retrac.selected_news_item;
  if (newsItem == null) return null;

  return (
    <div className="flex flex-col w-full @max-xl:w-full max-w-full @max-xl:max-w-full overflow-hidden">
      <OptionGroup _first>
        <div className="flex flex-col gap-[0.2rem] p-1.5 pb-0">
          <UI.H1 className="font-[300] text-neutral-300">
            {newsItem.title}
          </UI.H1>
          <UI.P className="text-neutral-400">
            written by {newsItem.authors}.
          </UI.P>
        </div>
      </OptionGroup>

      <OptionGroup _first _last _hideBorder _overflow>
        <div className="flex flex-col gap-2 p-1 max-h-[60vh] overflow-y-auto text-[14px] leading-[16px] text-neutral-300">
          <ReactMarkdown
            components={{
              img: ({ node, ...props }) => (
                // make it so the imagex are inline with text
                <img
                  className="h-4 max-h-4 w-4 max-w-4 inline select-none"
                  draggable={false}
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="min-w-fit" {...props} />
              ),
            }}
          >
            {newsItem.body}
          </ReactMarkdown>
        </div>
      </OptionGroup>
    </div>
  );
};

const NewsModalParent = () => {
  const retrac = useRetrac();

  const widgetContainerReference = useRef<HTMLDivElement>(null);
  const widgetReference = useRef<HTMLDivElement>(null);

  const widgetContainerClicked = (e: MouseEvent) => {
    if (!widgetReference.current)
      return console.error("widgetReference is null");
    if (!widgetContainerReference.current)
      return console.error("widgetContainerReference is null");

    if (widgetReference.current.contains(e.target as Node)) return;

    retrac.set_show_news(false);
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
  }, [retrac.show_news, widgetContainerReference, widgetReference]);

  return (
    <AnimatePresence key="recent-matches-parent">
      {retrac.show_news && (
        <motion.div
          ref={widgetContainerReference}
          className="fixed flex flex-col items-center justify-center w-full h-full top-0 left-0 bg-neutral-950/50 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key="recent-matches"
          transition={{ duration: 0.075, type: "tween" }}
        >
          <div
            className="absolute w-full h-8 top-0 left-0"
            data-tauri-drag-region
          ></div>
          <motion.div
            ref={widgetReference}
            className="relative flex flex-col min-w-96 w-[48%] max-h-[80%] bg-neutral-900 border-neutral-800 border-1 border-solid shadow-neutral-900/30 shadow-lg rounded-md"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 19 }}
          >
            <NewsModalWidget />
            <HiX
              className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-300 cursor-pointer"
              onClick={() => retrac.set_show_news(false)}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsModalParent;
