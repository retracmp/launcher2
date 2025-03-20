import { IoSkullSharp } from "react-icons/io5";
import UI from "src/components/core/default";
import { formatTime } from "src/helpers/time";
import { useUserManager } from "src/wrapper/user";

const RecentMatchesWidget = () => {
  const user = useUserManager();
  if (user._user === null) return null;

  const stats = Object.values(user._user.Account.Stats);
  const matches = stats
    .flatMap((stat) => Object.values(stat.Matches))
    .sort(
      (matchA, matchB) =>
        new Date(matchB.CreatedAt).getTime() -
        new Date(matchA.CreatedAt).getTime()
    )
    .slice(0, 5);

  return (
    // <div className="flex flex-col p-2 gap-1 w-full @max-xl:w-full max-w-full @max-xl:max-w-full bg-neutral-800/10 rounded-xs border-[#2e2e2e] border-1 border-solid overflow-hidden">
    <div className="flex flex-col gap-1 w-full @max-xl:w-full max-w-full @max-xl:max-w-full overflow-hidden">
      {/* <UI.P>
        <span className="font-[500] font-geist">Recent Matches</span>
      </UI.P> */}

      <div className="flex flex-col gap-1 overflow-hidden">
        {matches.map((match) => (
          <RecentMatch match={match} key={match.ID} />
        ))}
        <p className="mt-auto p-0.5 font-plex leading-[14px] min-w-max cursor-pointer hover:underline text-neutral-500 text-[12px]">
          View All...
        </p>
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
    props.match.Placement === 1
      ? "st"
      : props.match.Placement === 2
      ? "nd"
      : props.match.Placement === 3
      ? "rd"
      : "th";

  const timeAlive = formatTime(
    new Date(props.match.TimeAlive).getTime() / 1000 / 1000,
    0,
    false
  );

  return (
    <div className="overflow-hidden whitespace-nowrap overflow-ellipsis flex flex-row items-center p-2 gap-1 w-full bg-neutral-800/10 rounded-xs border-[#2e2e2e]/50 border-1 border-solid">
      {/* <p className="font-plex text-[14px] text-base leading-[16px] cursor-pointer hover:underline text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden">
        <span className="text-neutral-300 font-geist font-[600]">
          {props.match.Placement}
          {placementSuffix} Place
        </span>{" "}
        • {niceTeamType} • {props.match.Eliminations} <IoSkullSharp /> • Alive
        for {timeAlive}
      </p> */}

      <UI.P className="font-geist font-[600] text-neutral-300">
        {props.match.Placement}
        {placementSuffix} Place
      </UI.P>

      <UI.P className="text-neutral-400 flex flex-row gap-0.5 items-center">
        {props.match.Eliminations} <IoSkullSharp />
      </UI.P>

      <UI.P className="ml-auto font-mono text-neutral-700">{shortId}</UI.P>
    </div>
  );
};

export default RecentMatchesWidget;
