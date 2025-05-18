import { useEffect, useRef } from "react";
import { formatTime } from "src/helpers/time";
import { useUserManager } from "src/wrapper/user";
import { useRetrac } from "src/wrapper/retrac";

import { AnimatePresence, motion } from "motion/react";
import { HiX } from "react-icons/hi";
import UI from "src/components/core/default";

const RecentMatchesWidget = () => {
  const user = useUserManager();
  if (user._user === null)
    return (
      console.error("cannot load recent matches widget: user._user = null") ??
      null
    );

  const stats = Object.values(user._user.Account.Stats);
  const matches = stats
    .flatMap((stat) => Object.values(stat.Matches))
    .sort(
      (matchA, matchB) =>
        new Date(matchB.CreatedAt).getTime() -
        new Date(matchA.CreatedAt).getTime()
    )
    .filter((match) => match.TimeAlive != 0);

  if (matches.length === 0)
    return (
      console.error("cannot load recent matches widget: matches.length = 0") ??
      null
    );

  return (
    <div className="flex flex-col gap-1.5 w-full @max-xl:w-full max-w-full @max-xl:max-w-full overflow-hidden">
      <UI.P>
        <span className="font-[500] font-geist">Recent Matches</span>
      </UI.P>
      <div className="flex flex-col gap-1 overflow-auto">
        {matches.map((match) => (
          <RecentMatch match={match} key={match.ID} />
        ))}
      </div>
    </div>
  );
};

type RecentMatchProps = {
  match: StatMatch;
};

const RecentMatch = (props: RecentMatchProps) => {
  const shortId = props.match.ID.slice(0, 8);
  const niceTeamType =
    props.match.TeamType.charAt(0).toUpperCase() +
    props.match.TeamType.slice(1);
  const placementSuffix =
    props.match.Placement === 0
      ? "st"
      : props.match.Placement === 1
      ? "st"
      : props.match.Placement === 2
      ? "nd"
      : props.match.Placement === 3
      ? "rd"
      : "th";

  const timeAlive = formatTime(
    new Date(props.match.TimeAlive).getTime() / 1000 / 1000,
    0,
    true
  );

  return (
    <div className="overflow-hidden whitespace-nowrap overflow-ellipsis flex flex-row items-center p-2 gap-1 w-full bg-neutral-800/30 rounded-sm border-[#2e2e2e]/50 border-1 border-solid text-neutral-700 min-h-[2.125rem]">
      <UI.P className="font-mono text-neutral-400">{niceTeamType} •</UI.P>
      <p className="font-plex text-[14px] text-base leading-[16px] text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden">
        <span className="text-neutral-300 font-geist font-[600]">
          {props.match.Placement || 1}
          {placementSuffix}
        </span>
      </p>
      <UI.P className="font-mono text-neutral-400">with</UI.P>
      <p className="font-plex text-[14px] text-base leading-[16px] text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden">
        <span className="text-neutral-300 flex flex-row items-center gap-0.5">
          {props.match.Eliminations} Kills
        </span>
      </p>
      <UI.P className="ml-auto font-mono text-neutral-700">{timeAlive} •</UI.P>
      <UI.P className="font-mono text-neutral-700">{shortId}</UI.P>
    </div>
  );
};

const RecentMatchesParent = () => {
  const retrac = useRetrac();

  const widgetContainerReference = useRef<HTMLDivElement>(null);
  const widgetReference = useRef<HTMLDivElement>(null);

  const widgetContainerClicked = (e: MouseEvent) => {
    if (!widgetReference.current)
      return console.error("widgetReference is null");
    if (!widgetContainerReference.current)
      return console.error("widgetContainerReference is null");

    if (widgetReference.current.contains(e.target as Node)) return;

    retrac.set_show_recent_matches(false);
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
    <AnimatePresence key="recent-matches-parent">
      {retrac.show_recent_matches && (
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
            className="relative flex flex-col p-2 gap-2 min-w-96 w-[60%] max-h-[80%] bg-neutral-900 border-neutral-800 border-1 border-solid shadow-neutral-900/30 shadow-lg rounded-sm"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 19 }}
          >
            <RecentMatchesWidget />
            <HiX
              className="absolute right-1.5 top-1.5 text-neutral-500 hover:text-neutral-300 cursor-pointer"
              onClick={() => retrac.set_show_recent_matches(false)}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecentMatchesParent;
