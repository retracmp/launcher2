import { formatTime } from "src/helpers/time";

import UI from "src/components/core/default";
import { useEffect } from "react";
import { useLauncherSocket } from "src/sockets";
import { useAggregatedStats } from "src/wrapper/aggregated_stats";

const StatisticsWidget = () => {
  const socket = useLauncherSocket();
  const aggregatedStats = useAggregatedStats();

  const onSocketAggregatedstats = (
    data: SocketDownEventDataFromType<"aggregated_stats">
  ) => {
    aggregatedStats.add_from_response(data.aggregated_stats);
  };

  useEffect(() => {
    if (!socket.socket) return;

    socket.send({
      id: "request_aggregated_stats",
    } as Omit<SocketUpEventDataFromType<"request_aggregated_stats">, "version">);

    socket.bind("aggregated_stats", onSocketAggregatedstats);

    return () => {
      socket.unbind("aggregated_stats", onSocketAggregatedstats);
    };
  }, [socket.socket]);

  const using_stats = aggregatedStats.aggregatedStats;

  const eliminations = using_stats?.EliminationAll || 0;
  const matchesPlayed = using_stats?.MatchesPlayedAll || 0;
  const victoryRoyales = using_stats?.VictoriesAll || 0;
  const timeAlive = using_stats?.TimeAliveAll || 0;

  console.log(using_stats?.TimeAliveAll);

  return (
    <div className="flex flex-col p-2 w-[40%] @max-2xl:w-full min-w-max bg-neutral-800/10 rounded-sm border-neutral-700/40 border-1 border-solid backdrop-blur-sm">
      <UI.P>
        <span className="font-[500] font-geist">Your Statistics</span>
      </UI.P>

      <div className="flex flex-col gap-[2px] mt-[5px]">
        <div className="flex flex-row w-full items-center gap-2">
          <UI.P className="text-neutral-500">Eliminations</UI.P>
          <div className="w-full min-w-8 h-[1px] bg-neutral-600/20"></div>
          <UI.P>{eliminations.toLocaleString()}</UI.P>
        </div>
        <div className="flex flex-row w-full items-center gap-2">
          <UI.P className="text-neutral-500">Victory Royales</UI.P>
          <div className="w-full min-w-8 h-[1px] bg-neutral-600/20"></div>
          <UI.P>{victoryRoyales.toLocaleString()}</UI.P>
        </div>
        <div className="flex flex-row w-full items-center gap-2">
          <UI.P className="text-neutral-500">Matches Played</UI.P>
          <div className="w-full min-w-8 h-[1px] bg-neutral-600/20"></div>
          <UI.P>{matchesPlayed.toLocaleString()}</UI.P>
        </div>
        <div className="flex flex-row w-full items-center gap-2">
          <UI.P className="text-neutral-500">Time Alive</UI.P>
          <div className="w-full min-w-8 h-[1px] bg-neutral-600/20"></div>
          <UI.P>{formatTime(timeAlive * 1000)}</UI.P>
        </div>
      </div>
    </div>
  );
};

export default StatisticsWidget;
