import { useLeaderboard } from "src/wrapper/leaderboard";
import { useUserManager } from "src/wrapper/user";
import { useUsernameLookup } from "src/wrapper/usernames";
import { twJoin } from "tailwind-merge";

type LeaderboardEntryProps = {
  entry?: LeaderboardEntry | null;
  rank?: LeaderboardRankInformation | null;
};

const LeaderboardEntry = (props: LeaderboardEntryProps) => {
  const usernames = useUsernameLookup();
  const leaderboard = useLeaderboard();
  const current_account_id = useUserManager((s) => s._user?.account.id);

  if (props.entry === null && props.rank === null)
    return <LeaderboardEntryEmpty />;

  const account = props.rank?.account || props.entry?.AccountID!;
  const rank = props.rank?.current_rank || props.entry?.Rank!;

  const entry_stat = leaderboard.get_cached_stats(account);
  if (!entry_stat) return <LeaderboardEntryEmpty />;

  const username = usernames.lookup_username(account) || account;
  if (!username) return <LeaderboardEntryEmpty />;

  return (
    <tr
      className={twJoin(
        "text-neutral-300 text-sm leading-[15px]",
        rank === 1
          ? "bg-amber-300/5"
          : rank === 2
          ? "bg-fuchsia-50/5"
          : rank === 3
          ? "bg-orange-400/5"
          : "odd:bg-neutral-800/10"
      )}
    >
      <td
        className={twJoin(
          "w-[1%] font-normal text-center text-neutral-400",
          props.rank != undefined &&
            "cursor-pointer duration-75 hover:duration-[20ms] hover:bg-neutral-800/20",
          rank === 1 && "text-yellow-300",
          rank === 2 && "text-cyan-50"
        )}
        onClick={() =>
          props.rank != undefined &&
          leaderboard.set_page(props.rank.page_number)
        }
      >
        {rank}
      </td>
      <td className={twJoin(current_account_id === account && "font-semibold")}>
        {username}
      </td>
      <td className="w-[1%] text-center">{entry_stat.EliminationAll}</td>
      <td className="w-[1%] text-center">{entry_stat.VictoriesAll}</td>
      <td className="w-[1%] text-center">{entry_stat.ArenaPointsAll}</td>
    </tr>
  );
};

export const LeaderboardEntryEmpty = () => {
  return (
    <tr className="odd:bg-neutral-800/10 text-neutral-500 text-sm leading-[15px]">
      <td className="w-[1%] font-normal text-center">?</td>
      <td>Loading</td>
      <td className="w-[1%] text-center">0</td>
      <td className="w-[1%] text-center">0</td>
      <td className="w-[1%] text-center">0</td>
    </tr>
  );
};

export default LeaderboardEntry;
