import { useEffect } from "react";
import { useSocket } from "src/socket";
import { useLeaderboard } from "src/wrapper/leaderboard";
import { useOptions } from "src/wrapper/options";

import UI from "src/components/core/default";
import {
  IoChevronBackSharp,
  IoChevronForwardSharp,
  IoReloadSharp,
} from "react-icons/io5";
import LeaderboardItem, {
  EmptyLeaderboardItem,
} from "src/components/routes/app/leaderboard/item";
import { OptionGroup } from "../settings/option";

const LeaderboardPage = () => {
  const socket = useSocket();
  const leaderboard = useLeaderboard();
  const options = useOptions();

  const onSocketLeaderboard = (
    data: SocketDownEventDataFromType<"leaderboard">
  ) => {
    if (data.leaderboard.length === 0) return;
    leaderboard.populateLeaderboard(
      data.leaderboard[0].sortedBy,
      data.leaderboard,
      data.pageInfo.page
    );
    leaderboard.populateMe(data.leaderboard[0].sortedBy, data.you);
    leaderboard.setPageInfo(data.pageInfo);
  };

  useEffect(() => {
    if (!socket._socket) return;
    socket.bind("leaderboard", onSocketLeaderboard);

    return () => {
      socket.unbind("leaderboard", onSocketLeaderboard);
    };
  }, [socket._socket]);

  useEffect(() => {
    socket.send({
      id: "request_leaderboard",
      pagination: {
        page: leaderboard._page,
        pageSize: options.leaderboard_page_size,
        sortBy: leaderboard.activeSortedBy,
      },
    } as Omit<SocketUpEventDataFromType<"request_leaderboard">, "version">);
  }, [
    leaderboard._page,
    options.leaderboard_page_size,
    leaderboard.activeSortedBy,
  ]);

  const currentLeaderboard = leaderboard.getLeaderboard(
    leaderboard.activeSortedBy,
    leaderboard._page
  );
  const currentMe = leaderboard.getMe(leaderboard.activeSortedBy);

  return (
    <>
      <OptionGroup _first>
        <div className="flex flex-col gap-[0.2rem]">
          <UI.H1 className="font-[300] text-neutral-300">Leaderboard</UI.H1>
          <UI.P className="text-neutral-400">
            View the global rankings of players sorted by their wins,
            eliminations, or arena score.
          </UI.P>
        </div>
      </OptionGroup>

      <OptionGroup title="Your Position">
        <div className="border-neutral-700/40 border-[1px] border-solid rounded-sm overflow-hidden">
          {currentMe && (
            <LeaderboardItem
              key={currentMe.sortedBy + currentMe.accountId}
              position={currentMe.position}
              leaderboardItem={currentMe}
              _last
              _me
            />
          )}

          {!currentMe && (
            <EmptyLeaderboardItem key="empty-me" position={1} _last />
          )}
        </div>

        <span></span>
      </OptionGroup>

      <OptionGroup title="Global Rankings" _last>
        <div className="border-neutral-700/40 border-[1px] border-solid rounded-sm overflow-hidden">
          <div
            className={`relative flex flex-row border-neutral-700/40 border-b-[1px] border-solid bg-neutral-800/20`}
          >
            <UI.P className="flex items-center justify-center min-w-4 w-8 max-w-8 px-2 text-center font-[600] border-neutral-700/40 border-r-[1px] border-solid text-neutral-500">
              #
            </UI.P>
            <UI.P className="flex items-center justify-center py-1.5 p-2 text-neutral-500">
              Display Name
            </UI.P>
            <span className="ml-auto"></span>
            <UI.P
              className={`flex items-center justify-center py-1.5 min-w-16 w-16 border-neutral-700/40 border-l-[1px] border-solid cursor-pointer ${
                leaderboard.activeSortedBy === "eliminations"
                  ? "font-[600]"
                  : "text-neutral-500"
              }`}
              onClick={() => leaderboard.setSortedBy("eliminations")}
            >
              Kills
            </UI.P>
            <UI.P
              className={`flex items-center justify-center py-1.5 min-w-16 w-16 border-neutral-700/40 border-l-[1px] border-solid cursor-pointer ${
                leaderboard.activeSortedBy === "points"
                  ? "font-[600]"
                  : "text-neutral-500"
              }`}
              onClick={() => leaderboard.setSortedBy("points")}
            >
              Wins
            </UI.P>
          </div>
          {currentLeaderboard &&
            currentLeaderboard.length > 0 &&
            currentLeaderboard.map((leaderboardItem, index, array) => (
              <LeaderboardItem
                key={leaderboardItem.sortedBy + leaderboardItem.accountId}
                position={index + 1}
                leaderboardItem={leaderboardItem}
                _last={index === array.length - 1 ? true : false}
              />
            ))}
          {(!currentLeaderboard || currentLeaderboard.length === 0) &&
            new Array(options.leaderboard_page_size)
              .fill(0)
              .map((_, index, a) => (
                <EmptyLeaderboardItem
                  key={index}
                  position={index + 1}
                  _last={index === a.length - 1 ? true : false}
                />
              ))}
        </div>

        <div className="flex flex-row gap-1 pt-[0.2rem]">
          <div className="backdrop-blur-md bg-transparent border-neutral-500/20 border-1 border-solid min-w-max p-0.5 px-2 rounded-sm text-neutral-300 font-plex text-[14px] text-base flex flex-row items-center justify-center gap-2 disabled:text-neutral-500 disabled:hover:bg-neutral-500/20 disabled:cursor-not-allowed">
            <span className="text-neutral-400 text-sm">
              Page {leaderboard._page} of {leaderboard._pageInfo.totalPages}
            </span>
          </div>
          <span className="ml-auto"></span>
          <UI.Button
            colour="invisible"
            className="py-2 px-2 z-10 w-min gap-0 backdrop-blur-md"
            onClick={leaderboard.resetPage}
          >
            <span className="text-neutral-400">
              <IoReloadSharp className="w-4 h-4" />
            </span>
          </UI.Button>
          <UI.Button
            colour="invisible"
            className="py-2 px-2 z-10 w-min gap-0 backdrop-blur-md"
            onClick={leaderboard.prevPage}
            disabled={leaderboard._page <= 1 ? true : false}
          >
            <span className="text-neutral-400">
              <IoChevronBackSharp className="w-4 h-4" />
            </span>
          </UI.Button>
          <UI.Button
            colour="invisible"
            className="py-2 px-2 z-10 w-min gap-0 backdrop-blur-md"
            onClick={leaderboard.nextPage}
            disabled={
              leaderboard._page >= leaderboard._pageInfo.totalPages
                ? true
                : false
            }
          >
            <span className="text-neutral-400">
              <IoChevronForwardSharp className="w-4 h-4" />
            </span>
          </UI.Button>
        </div>
      </OptionGroup>
    </>
  );
};

export default LeaderboardPage;
