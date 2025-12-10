import { useEffect, useRef } from "react";
import { formatTime } from "src/helpers/time";
import { useRetrac } from "src/wrapper/retrac";
import { useMatches } from "src/wrapper/matches";
import { useLauncherSocket } from "src/sockets";

import UI from "src/components/core/default";
import { AnimatePresence, motion } from "motion/react";
import { HiX } from "react-icons/hi";
import { OptionGroup } from "src/components/core/option";

const RecentMatchesWidget = () => {
  const matches = useMatches();
  const socket = useLauncherSocket();

  const onSocketRecieveMatchesInfo = (
    data: SocketDownEventDataFromType<"match_response">
  ) => {
    matches.add_from_response(data.matches);
  };

  useEffect(() => {
    if (socket.socket === null) return;
    socket.bind("match_response", onSocketRecieveMatchesInfo);

    socket.send({
      id: "request_matches",
    } as Omit<SocketUpEventDataFromType<"request_matches">, "version">);

    return () => {
      socket.unbind("match_response", onSocketRecieveMatchesInfo);
    };
  }, [socket.socket]);

  return (
    <div className="flex flex-col w-full @max-xl:w-full max-w-full @max-xl:max-w-full overflow-hidden">
      <OptionGroup _first>
        <div className="flex flex-col gap-[0.2rem] p-1.5 pb-0">
          <UI.H1 className="font-[300] text-neutral-300">Matches</UI.H1>
          <UI.P className="text-neutral-400">
            View your recent match history with details.
          </UI.P>
        </div>
      </OptionGroup>
      <OptionGroup _first _last _hideBorder _overflow>
        {matches.all_matches().map((match) => (
          <RecentMatch match={match} key={match.match_id} />
        ))}
        {matches.all_matches().length === 0 && (
          <p className="text-sm leading-4 text-neutral-400 p-2">
            No matches to display.
          </p>
        )}
      </OptionGroup>
    </div>
  );
};

type RecentMatchProps = {
  match: SavedMatch;
};

const RecentMatch = (props: RecentMatchProps) => {
  const shortId = props.match.match_id.slice(0, 8);

  const teamType = ((team_size: number) => {
    return {
      1: "Solo",
      2: "Duo",
      3: "Trio",
      4: "Squad",
    }[team_size];
  })(props.match.team_size);

  const placementSuffix = (() => {
    const placement = props.match.placement;
    if (placement % 10 === 1 && placement % 100 !== 11) return "st";
    if (placement % 10 === 2 && placement % 100 !== 12) return "nd";
    if (placement % 10 === 3 && placement % 100 !== 13) return "rd";
    return "th";
  })();

  const ended_at = new Date(props.match.ended_at || Date.now());
  const started_at = new Date(props.match.started_at);
  const timeAlive = formatTime(
    ended_at.getTime() - started_at.getTime(),
    0,
    true
  );

  return (
    <div className="overflow-hidden whitespace-nowrap overflow-ellipsis flex flex-row items-center p-2 gap-1 w-full bg-neutral-800/30 rounded-sm border-neutral-700/10 border-1 border-solid text-neutral-700 min-h-[2.125rem]">
      <UI.P className="font-mono text-neutral-400">{teamType} •</UI.P>
      <p className="font-plex text-[14px] text-base leading-[16px] text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden">
        <span className="text-neutral-300 font-geist font-[600]">
          {props.match.placement || 1}
          {placementSuffix}
        </span>
      </p>
      <UI.P className="font-mono text-neutral-400">with</UI.P>
      <p className="font-plex text-[14px] text-base leading-[16px] text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden">
        <span className="text-neutral-300 flex flex-row items-center gap-0.5">
          {props.match.eliminations.length} Kills
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
  }, [retrac.show_recent_matches, widgetContainerReference, widgetReference]);

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
            className="relative flex flex-col min-w-96 w-[40%] max-h-[80%] bg-neutral-900 border-neutral-800 border-1 border-solid shadow-neutral-900/30 shadow-lg rounded-md"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 19 }}
          >
            <RecentMatchesWidget />
            <HiX
              className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-300 cursor-pointer"
              onClick={() => retrac.set_show_recent_matches(false)}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecentMatchesParent;
