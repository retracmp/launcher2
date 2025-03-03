import { useEffect, useState } from "react";
import { useRetrac } from "src/wrapper/retrac";

import { IoTimeSharp } from "react-icons/io5";
import UI from "src/components/core/default";
import { formatTime } from "src/helpers/time";

const EventsWidget = () => {
  const [selected, setSelected] = useState(0);

  const news = useRetrac((s) => s.events);
  if (news.length === 0) return null;

  const filtered = news.filter(
    (e) => !e.event.IsArena && new Date(e.event.Expire) > new Date()
  );
  if (filtered.length === 0) return null;

  useEffect(() => {
    const interval = setInterval(() => {
      setSelected((prev) => (prev + 1) % filtered.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [filtered]);

  return (
    <div className="group flex flex-col gap-2 relative max-h-[14.1rem] w-[55%] aspect-[16/8.5] bg-neutral-800/10 rounded-xs border-[#2e2e2e] border-1 border-solid cursor-pointer overflow-hidden">
      <EventDisplay event={filtered[selected]} />
    </div>
  );
};

type EventDisplayProps = {
  event: LauncherEventItem;
};

const EventDisplay = (props: EventDisplayProps) => {
  const nextWindowIndex = props.event.event.Windows.reduce(
    (acc, window, idx) => {
      if (new Date(window.Start) > new Date()) {
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
        new Date(window.Start) < new Date() &&
        new Date(window.End) > new Date()
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
        className="absolute w-full h-full object-center object-cover opacity-80 group-hover:opacity-75 top-0 left-0"
        src={props.event.style.playlist_tile_image}
        draggable={false}
      />

      <div className="absolute z-10 top-2 left-2 flex flex-row gap-1">
        {nextWindowIndex !== -1 && (
          <StartsInTag
            start={props.event.event.Windows[nextWindowIndex].Start}
          />
        )}
        {currentWindowIndex !== -1 && (
          <UI.P className="bg-red-600/20 uppercase p-0.5 px-1 font-geist font-[700] text-[12px] text-neutral-100 backdrop-blur-xs">
            LIVE NOW
          </UI.P>
        )}
        {props.event.style.schedule_info !== "" && (
          <UI.P
            className="uppercase p-0.5 px-1 font-geist font-[700] text-[12px] text-neutral-100 backdrop-blur-xs"
            style={{
              backgroundColor: `#${props.event.style.secondary_color}40`,
            }}
          >
            {props.event.style.schedule_info}
          </UI.P>
        )}
      </div>

      <div className="mt-auto z-10 flex flex-col p-2 bg-neutral-800/50 gap-0.5">
        <UI.P className="text-[16px] font-geist font-[700]">
          {props.event.style.short_format_title}
        </UI.P>
        <UI.P className="text-neutral-300">
          {props.event.style.details_description}
        </UI.P>
      </div>

      <div
        key={props.event.event.ID}
        className="absolute w-full h-0.5 bg-white z-10 animate-move opacity-50"
      ></div>
    </>
  );
};

type StartsInTagProps = {
  start: string;
};

const StartsInTag = (props: StartsInTagProps) => {
  const now = new Date();
  const start = new Date(props.start);
  if (start < now) return null;
  const diff = start.getTime() - now.getTime();

  return (
    <UI.P className="flex flex-row gap-0.5 bg-neutral-800/30 uppercase p-0.5 px-1 font-geist font-[700] text-[12px] text-neutral-100 backdrop-blur-xs">
      <IoTimeSharp className="text-neutral-100" />
      STARTS IN {formatTime(diff, 0, false).toUpperCase()}
    </UI.P>
  );
};

export default EventsWidget;
