import { useLeaderboard } from "src/wrapper/leaderboard";
import { useUserManager } from "src/wrapper/user";
import { useOptions } from "src/wrapper/options";
import { useUsernameLookup } from "src/wrapper/usernames";

import UI from "src/components/core/default";

type LeaderboardItemProps = {
  position: number;
  leaderboardItem: LeaderboardEntry;
  _last?: boolean;
  _me?: boolean;
};

const LeaderboardItem = (props: LeaderboardItemProps) => {
  const me = useUserManager();
  const leaderboard = useLeaderboard();
  const options = useOptions();
  const usernames = useUsernameLookup();

  const stats = leaderboard.getCachedStats(props.leaderboardItem.AccountID);
  const username = usernames.lookup_username(props.leaderboardItem.AccountID);
  const renderedName =
    props._me && me._user
      ? me._user.account.display_name || me._user.account.id
      : username ||
        `Player ${props.leaderboardItem.AccountID.substring(16, 20)}`;

  const styledPosition = {
    1: "text-yellow-400",
    2: "text-sky-200",
    3: "text-orange-300",
    10: "text-pink-100",
    Infinity: "text-neutral-400",
  };
  const styledPositionClass =
    (() => {
      for (const [key, value] of Object.entries(styledPosition)) {
        if (props.leaderboardItem.Rank <= Number(key)) {
          return value;
        }
      }
    })() || "";

  const myPageIndex =
    props.leaderboardItem.Rank / options.leaderboard_page_size;
  const myPageIndexFloor = Math.ceil(myPageIndex);

  return (
    <div
      className={`relative grid grid-cols-[48px_1fr_64px_64px] border-neutral-700/40 ${
        !props._last ? "border-b-[1px]" : ""
      } border-solid backdrop-blur-md ${
        props.position % 2 === 0 ? "bg-neutral-800/20" : ""
      }`}
    >
      <UI.P
        className={`flex items-center justify-center text-center font-[600] border-neutral-700/40 border-r-[1px] border-solid text-neutral-400 ${styledPositionClass} ${
          props._me ? "cursor-pointer hover:bg-neutral-800/20" : ""
        }`}
        onClick={() => {
          if (!props._me) return;
          leaderboard.setPage(myPageIndexFloor);
        }}
      >
        {props.leaderboardItem.Rank}
      </UI.P>
      <UI.P
        className={`flex items-center justify-start py-2 px-3 ${
          props.leaderboardItem.AccountID === me._user?.account.id
            ? "font-semibold"
            : ""
        }`}
      >
        {renderedName}
      </UI.P>
      <UI.P className="flex items-center justify-center py-2 border-neutral-700/40 border-l-[1px] border-solid">
        {stats?.EliminationAll || 0}
      </UI.P>
      <UI.P className="flex items-center justify-center py-2 border-neutral-700/40 border-l-[1px] border-solid">
        {stats?.VictoriesAll || 0}
      </UI.P>
    </div>
  );
};

type EmptyLeaderboardItemProps = {
  position: number;
  _last?: boolean;
};

const EmptyLeaderboardItem = (props: EmptyLeaderboardItemProps) => {
  return (
    <div
      className={`relative grid grid-cols-[48px_1fr_64px_64px] border-neutral-700/40 backdrop-blur-md ${
        !props._last ? "border-b-[1px]" : ""
      } border-solid ${props.position % 2 === 0 ? "bg-neutral-800/20" : ""}`}
    >
      <UI.P className="flex items-center justify-center text-center font-[600] border-neutral-700/40 border-r-[1px] border-solid text-neutral-500">
        ?
      </UI.P>
      <UI.P className="flex items-center justify-center py-2 p-2 text-neutral-500">
        Loading
      </UI.P>
      <UI.P className="flex items-center justify-center py-2 border-neutral-700/40 border-l-[1px] border-solid text-neutral-500">
        0
      </UI.P>
      <UI.P className="flex items-center justify-center py-2 border-neutral-700/40 border-l-[1px] border-solid text-neutral-500">
        0
      </UI.P>
    </div>
  );
};

export { EmptyLeaderboardItem };
export default LeaderboardItem;
