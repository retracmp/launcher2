import { useEffect, useState } from "react";
import { useRetrac } from "src/wrapper/retrac";
import { msUntil, msUntilDate, renderTimeUntil } from "src/helpers/time";

import { IoTimeSharp } from "react-icons/io5";
import { TbPointFilled } from "react-icons/tb";
import UI from "src/components/core/default";

type EventsWidgetProps = {
  withScoringRules?: boolean;
};

const EventsWidget = (props: EventsWidgetProps) => {
  const [selected, setSelected] = useState(0);

  const news = useRetrac((s) => s.events);
  if (news.length === 0)
    return console.error("cannot load events widget: news.length = 0") ?? null;

  const filtered = news.filter(
    (e) => !e.event.IsArena && new Date(e.event.Expire) > new Date()
  );
  if (filtered.length === 0)
    return (
      console.error("cannot load events widget: filtered.length = 0") ?? null
    );

  useEffect(() => {
    const interval = setInterval(() => {
      setSelected((prev) => (prev + 1) % filtered.length);
      console.log(
        `EventsWidget: changing event to ${filtered[selected].event.ID}`
      );
    }, 7000);

    return () => clearInterval(interval);
  }, [filtered]);

  return (
    <>
      <div className="group flex flex-col gap-2 relative max-h-50 w-[60%] min-w-[50%] @max-xl:w-full aspect-[16/8.5] bg-neutral-800/10 rounded-sm border-neutral-700/40 border-1 border-solid cursor-pointer overflow-hidden">
        <EventDisplay event={filtered[selected]} />
      </div>

      {props.withScoringRules && <ScoringRules event={filtered[selected]} />}
    </>
  );
};

type EventDisplayProps = {
  event: LauncherEventItem;
};

const EventDisplay = (props: EventDisplayProps) => {
  const nextWindowIndex = props.event.event.Windows.reduce(
    (acc, window, idx) => {
      if (msUntil(window.Start) > msUntilDate(new Date())) {
        acc = idx;
        return acc;
      }

      return acc;
    },
    -1
  );

  const currentWindowIndex = props.event.event.Windows.reduce(
    (acc, window, idx) => {
      if (
        msUntil(window.Start) < msUntilDate(new Date()) &&
        msUntil(window.End) > msUntilDate(new Date())
      ) {
        acc = idx;
        return acc;
      }

      return acc;
    },
    -1
  );

  return (
    <>
      <img
        className="absolute w-full h-full object-center object-cover group-hover:opacity-95 top-0 left-0"
        src={props.event.style.playlist_tile_image}
        draggable={false}
        style={{
          maskImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0, 0.6))",
        }}
      />

      <div className="absolute z-10 top-2 left-2 flex flex-row gap-1">
        {nextWindowIndex !== -1 && (
          <StartsInTag
            start={props.event.event.Windows[nextWindowIndex].Start}
          />
        )}
        {currentWindowIndex !== -1 && (
          <div className="flex flex-row items-center bg-red-600/45 p-0.5 backdrop-blur-xs rounded-sm pr-">
            <TbPointFilled className="text-neutral-300 h-[15px] w-[15px]" />
            <UI.P className="uppercase font-geist font-[700] text-[12px] leading-[14px] text-neutral-100">
              LIVE NOW
            </UI.P>
          </div>
        )}
        {props.event.style.schedule_info !== "" && (
          <UI.P
            className="uppercase p-0.5 px-1 font-geist font-[700] text-[12px] text-neutral-400 backdrop-blur-xs"
            style={{
              backgroundColor: `#${props.event.style.secondary_color}40`,
            }}
          >
            {props.event.style.schedule_info}
          </UI.P>
        )}
      </div>

      <div className="mt-auto z-10 flex flex-col p-2 bg-neutral-800/80 gap-0.5 backdrop-blur-xs">
        <UI.P className="text-[16px] font-geist font-[700]">
          {props.event.style.short_format_title}
        </UI.P>
        <UI.P className="text-neutral-300/90">
          {props.event.style.details_description}
        </UI.P>
      </div>

      <div
        key={props.event.event.ID}
        className="absolute w-full h-0.5 bg-white/20 z-10 animate-move opacity-50"
      ></div>
    </>
  );
};

type StartsInTagProps = {
  start: string;
};

const StartsInTag = (props: StartsInTagProps) => {
  return (
    <div className="flex flex-row items-center gap-0.5 bg-neutral-800/30 p-0.5 backdrop-blur-xs rounded-sm">
      <IoTimeSharp className="text-neutral-300 h-[15px] w-[15px]" />
      <UI.P className="uppercase font-geist font-[700] text-[12px] leading-[14px] text-neutral-100">
        {renderTimeUntil(msUntil(props.start)).toUpperCase()}
      </UI.P>
    </div>
  );
};

type ScoringRulesProps = {
  event: LauncherEventItem;
};

const ScoringRules = (props: ScoringRulesProps) => {
  return (
    <div className="flex flex-col gap-2 flex-1 p-1">
      {/* p-2 bg-neutral-800/10 rounded-xs border-neutral-700/40 border-1 border-solid">
      {/* <div className="flex flex-col gap-[1px]"> */}
      {/* <UI.P className="font-geist font-[600] text-neutral-400">
          Scoring Rules
        </UI.P> */}

      {/* <UI.P className="text-neutral-500">
          You will earn points based on the following scoring rules.
        </UI.P> */}
      {/* </div> */}

      <div className="flex flex-col gap-2 flex-1">
        {props.event.event.Templates[0].ScoringRules.sort((a, b) => {
          if (a.Stat === "TEAM_ELIMS_STAT_INDEX") return -1;
          if (b.Stat === "TEAM_ELIMS_STAT_INDEX") return 1;
          return 0;
        }).map((rule) => (
          <ScoringRule rule={rule} key={rule.Stat} />
        ))}
      </div>
    </div>
  );
};

type ScoringRuleProps = {
  rule: LauncherEventItem["event"]["Templates"][0]["ScoringRules"][0];
};

const ScoringRule = (props: ScoringRuleProps) => {
  return (
    <div className="relative flex flex-row flex-wrap flex-1 gap-0.5 p-1.5 border-neutral-700/40 border-1 border-solid pt-2.5">
      <UI.P
        className="text-neutral-500 bg-neutral-800/20 absolute top-[-0.5rem] left-1 p-[0.1rem] pb-0"
        style={{
          fontSize: "12px",
        }}
      >
        {props.rule.Stat}
      </UI.P>

      {props.rule.Tiers.map((tier) => (
        <UI.P
          className="text-neutral-400"
          style={{
            fontSize: "12px",
            width: "calc(50% - 2px)",
          }}
          key={tier.Value}
        >
          {props.rule.Stat === "TEAM_ELIMS_STAT_INDEX" ? (
            <span className="text-neutral-400">Each Elimination</span>
          ) : (
            <span className="text-neutral-400">Reach Top {tier.Value}</span>
          )}

          <span className="text-neutral-300 font-geist font-[600]">
            {" +"}
            {tier.Points} Points
          </span>
        </UI.P>
      ))}
    </div>
  );
};

export default EventsWidget;
