import { useLauncherSocket } from "src/sockets";
import { useLeaderboard } from "src/wrapper/leaderboard";
import { useOptions } from "src/wrapper/options";
import { useUsernameLookup } from "src/wrapper/usernames";
import { useEffect } from "react";

import UI from "src/components/core/default";
import { OptionGroup } from "../../../core/option";
import LeaderboardEntry from "./item";
import { twJoin } from "tailwind-merge";
import { useUserManager } from "src/wrapper/user";
import {
  IoChevronBackSharp,
  IoChevronForwardSharp,
  IoReloadSharp,
} from "react-icons/io5";

const LeaderboardPage = () => {
  const leaderboard = useLeaderboard();
  const socket = useLauncherSocket();
  const options = useOptions();

  const current_account_id = useUserManager((s) => s._user?.account.id);
  const add_to_username_cache = useUsernameLookup((s) => s.add_from_response);

  const onSocketLeaderboard = (
    data: SocketDownEventDataFromType<"leaderboard">
  ) => {
    if (data.leaderboard.length === 0) return;
    leaderboard.populateLeaderboard(
      data.page_information.sortBy,
      data.leaderboard,
      data.page_information.page
    );
    leaderboard.populateMe(data.page_information.sortBy, data.rank_information);
    leaderboard.setPageInfo(data.page_information);
    leaderboard.addToStats(data.leaderboard_ranks);

    socket.send({
      id: "request_user_names",
      userAccountIds: Object.keys(data.leaderboard_ranks),
    } as Omit<SocketUpEventDataFromType<"request_user_names">, "version">);
  };

  const onSocketUsernames = (
    data: SocketDownEventDataFromType<"user_names">
  ) => {
    add_to_username_cache(data.user_names);
  };

  useEffect(() => {
    if (!socket.socket) return;
    socket.bind("leaderboard", onSocketLeaderboard);
    socket.bind("user_names", onSocketUsernames);

    return () => {
      socket.unbind("leaderboard", onSocketLeaderboard);
      socket.unbind("user_names", onSocketUsernames);
    };
  }, [socket.socket]);

  useEffect(() => {
    socket.send({
      id: "request_leaderboard",
      pagination: {
        page: leaderboard._page,
        pageSize: options.leaderboard_page_size,
        sortBy: leaderboard.current_sort_key,
        timeFrame: leaderboard.current_time_frame,
      },
    } as Omit<SocketUpEventDataFromType<"request_leaderboard">, "version">);
  }, [
    leaderboard._page,
    options.leaderboard_page_size,
    leaderboard.current_sort_key,
    leaderboard.current_time_frame,
  ]);

  const current_leaderboard = leaderboard.get_leaderboard(
    leaderboard.current_sort_key,
    leaderboard._page
  );
  const current_account_ranking = leaderboard.current_account_ranking(
    leaderboard.current_sort_key
  );

  const rendering_leaderboard: Array<LeaderboardEntry | null> =
    current_leaderboard
      ? current_leaderboard
      : new Array(options.leaderboard_page_size).fill(null);

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

      <OptionGroup title="Your Position" _last>
        <table className="w-full h-full ">
          <thead>
            <tr className="odd:bg-neutral-800/20 text-neutral-500 text-sm leading-[15px]">
              <th className="w-[1%] font-normal text-center">#</th>
              <th className="font-normal">Display Name</th>
              <LeaderboardSortKey sort_key="EliminationAll" title="Kills" />
              <LeaderboardSortKey sort_key="VictoriesAll" title="Wins" />
              <LeaderboardSortKey sort_key="ArenaPointsAll" title="Hype" />
            </tr>
          </thead>

          <tbody>
            <LeaderboardEntry
              rank={current_account_ranking}
              key={current_account_id}
            />
          </tbody>
        </table>
      </OptionGroup>

      <OptionGroup title="Leaderboard" _last>
        <table className="w-full h-full ">
          <thead>
            <tr className="odd:bg-neutral-800/20 text-neutral-500 text-sm leading-[15px]">
              <LeaderboardTimeFrame time_frame="Daily" label="Daily" />
              <LeaderboardTimeFrame time_frame="Weekly" label="Weekly" />
              <LeaderboardTimeFrame time_frame="AllTime" label="All Time" />
            </tr>
          </thead>
        </table>

        <table className="w-full h-full ">
          <thead>
            <tr className="odd:bg-neutral-800/20 text-neutral-500 text-sm leading-[15px]">
              <th className="w-[1%] font-normal text-center">#</th>
              <th className="font-normal">Display Name</th>
              <LeaderboardSortKey sort_key="EliminationAll" title="Kills" />
              <LeaderboardSortKey sort_key="VictoriesAll" title="Wins" />
              <LeaderboardSortKey sort_key="ArenaPointsAll" title="Hype" />
            </tr>
          </thead>

          <tbody>
            {rendering_leaderboard.map((s, i) => (
              <LeaderboardEntry entry={s} key={s?.AccountID || i} />
            ))}
          </tbody>
        </table>

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

type LeaderboardSortKeyProps = {
  title: string;
  sort_key: StatKey;
};

const LeaderboardSortKey = (props: LeaderboardSortKeyProps) => {
  const leaderboard = useLeaderboard();

  const handleSortKeyClicked = () => {
    leaderboard.set_sort_key(props.sort_key);
  };

  return (
    <th
      onClick={handleSortKeyClicked}
      className={twJoin(
        "w-[1%] font-normal cursor-pointer duration-75 hover:duration-[20ms] hover:bg-neutral-800/20",
        props.sort_key === leaderboard.current_sort_key
          ? "font-bold text-neutral-300 bg-neutral-800/20"
          : ""
      )}
    >
      {props.title}
    </th>
  );
};

type LeaderboardTimeFrameProps = {
  label: string;
  time_frame: TimeFrame;
};

const LeaderboardTimeFrame = (props: LeaderboardTimeFrameProps) => {
  const leaderboard = useLeaderboard();

  const handleTimeFrameClicked = () => {
    leaderboard.set_time_frame(props.time_frame);
    leaderboard.resetPage();
  };

  return (
    <th
      onClick={handleTimeFrameClicked}
      className={twJoin(
        "w-[1%] font-normal cursor-pointer duration-75 hover:duration-[20ms] hover:bg-neutral-800/20",
        props.time_frame === leaderboard.current_time_frame
          ? "text-neutral-300 bg-neutral-800/20"
          : "",
        props.time_frame === "Daily" && "round-bl",
        props.time_frame === "AllTime" && "round-br"
      )}
    >
      {props.label}
    </th>
  );
};

export default LeaderboardPage;
