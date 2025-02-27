import { formatTime } from "src/helpers/time";

import UI from "src/components/core/default";

type StatisticsWidgetProps = {
  account: User["Account"];
  season: number;
};

const StatisticsWidget = (props: StatisticsWidgetProps) => {
  const seasonStat = props.account.Stats[props.season];
  if (!seasonStat) return null;

  const eliminations = Object.values(seasonStat.Matches).reduce(
    (acc, match) => acc + match.Eliminations,
    0
  );
  const matchesPlayed = Object.values(seasonStat.Matches).length;
  const victoryRoyales = Object.values(seasonStat.Matches).filter(
    (match) => match.Placement === 1
  ).length;
  const timeAlive = Object.values(seasonStat.Matches).reduce((acc, match) => {
    return acc + new Date(match.TimeAlive).getTime();
  }, 0);

  return (
    <div className="flex flex-col p-2 w-[40%] min-w-max bg-neutral-800/10 rounded-xs border-[#2e2e2e] border-1 border-solid">
      <UI.P>
        <span className="font-[500] font-geist">Your Statistics</span>
      </UI.P>

      <div className="flex flex-col gap-[2px] mt-[5px]">
        <div className="flex flex-row w-full items-center gap-2">
          <UI.P className="text-neutral-500">Eliminations</UI.P>
          <div className="w-full min-w-8 h-[1px] bg-neutral-600/20"></div>
          <UI.P>{eliminations}</UI.P>
        </div>
        <div className="flex flex-row w-full items-center gap-2">
          <UI.P className="text-neutral-500">Victory Royales</UI.P>
          <div className="w-full min-w-8 h-[1px] bg-neutral-600/20"></div>
          <UI.P>{victoryRoyales}</UI.P>
        </div>
        <div className="flex flex-row w-full items-center gap-2">
          <UI.P className="text-neutral-500">Matches Played</UI.P>
          <div className="w-full min-w-8 h-[1px] bg-neutral-600/20"></div>
          <UI.P>{matchesPlayed}</UI.P>
        </div>
        <div className="flex flex-row w-full items-center gap-2">
          <UI.P className="text-neutral-500">Time Alive</UI.P>
          <div className="w-full min-w-8 h-[1px] bg-neutral-600/20"></div>
          <UI.P>{formatTime(timeAlive)}</UI.P>
        </div>
      </div>
    </div>
  );
};

export default StatisticsWidget;
