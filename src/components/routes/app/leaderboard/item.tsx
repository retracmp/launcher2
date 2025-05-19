import { useLeaderboard } from "src/wrapper/leaderboard";
import { useUserManager } from "src/wrapper/user";
import { useOptions } from "src/wrapper/options";

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

  const renderedName =
    props._me && me._user
      ? me._user.Account.DisplayName || me._user.ID
      : props.leaderboardItem.displayName || props.leaderboardItem.accountId;

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
        if (props.leaderboardItem.position <= Number(key)) {
          return value;
        }
      }
    })() || "";

  const myPageIndex =
    props.leaderboardItem.position / options.leaderboard_page_size;
  const myPageIndexFloor = Math.ceil(myPageIndex);

  return (
    <div
      className={`relative flex flex-row border-neutral-700/40 ${
        !props._last ? "border-b-[1px]" : ""
      } border-solid ${props.position % 2 === 0 ? "bg-neutral-800/20" : ""}`}
    >
      <UI.P
        className={`flex items-center justify-center min-w-4 w-8 max-w-8 px-2 text-center font-[600] border-neutral-700/40 border-r-[1px] border-solid text-neutral-400 ${styledPositionClass} ${
          props._me ? "cursor-pointer hover:bg-neutral-800/20" : ""
        }`}
        onClick={() => {
          if (!props._me) return;
          leaderboard.setPage(myPageIndexFloor);
        }}
      >
        {props.leaderboardItem.position}
      </UI.P>
      <UI.P
        className={`flex items-center justify-center py-2 p-2 ${
          props.leaderboardItem.accountId === me._user?.ID
            ? "font-semibold"
            : ""
        }`}
      >
        {renderedName}
      </UI.P>
      <span className="ml-auto"></span>
      <UI.P className="flex items-center justify-center py-2 min-w-16 w-16 border-neutral-700/40 border-l-[1px] border-solid">
        {props.leaderboardItem.otherElimValue}
      </UI.P>
      <UI.P className="flex items-center justify-center py-2 min-w-16 w-16 border-neutral-700/40 border-l-[1px] border-solid">
        {props.leaderboardItem.otherWinValue}
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
      className={`relative flex flex-row border-neutral-700/40 ${
        !props._last ? "border-b-[1px]" : ""
      } border-solid ${props.position % 2 === 0 ? "bg-neutral-800/20" : ""}`}
    >
      <UI.P className="flex items-center justify-center min-w-4 w-8 max-w-8 px-2 text-center font-[600] border-neutral-700/40 border-r-[1px] border-solid text-neutral-500">
        ?
      </UI.P>
      <UI.P className="flex items-center justify-center py-2 p-2 text-neutral-500">
        Loading
      </UI.P>
      <span className="ml-auto"></span>
      <UI.P className="flex items-center justify-center py-2 min-w-16 w-16 border-neutral-700/40 border-l-[1px] border-solid text-neutral-500">
        0
      </UI.P>
      <UI.P className="flex items-center justify-center py-2 min-w-16 w-16 border-neutral-700/40 border-l-[1px] border-solid text-neutral-500">
        0
      </UI.P>
    </div>
  );
};

export { EmptyLeaderboardItem };
export default LeaderboardItem;
