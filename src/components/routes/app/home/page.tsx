import { useUserManager } from "src/wrapper/user";

import UI from "src/components/core/default";
import CharacterWidget from "src/components/routes/app/home/widgets/character";
import StatisticsWidget from "src/components/routes/app/home/widgets/statistics";
import FortniteWidget from "src/components/routes/app/home/widgets/fortnite";
import NewsWidget from "src/components/routes/app/home/widgets/news";
import EventsWidget from "src/components/routes/app/home/widgets/events";

const HomePage = () => {
  const userManager = useUserManager();
  if (userManager._user == null || userManager._season == null) return null;

  return (
    <>
      <div className="flex flex-row gap-1 p-1.5 pb-0 @max-xl:flex-col">
        <CharacterWidget
          user={userManager._user}
          season={userManager._season}
        />
        <StatisticsWidget
          account={userManager._user.Account}
          season={userManager._season}
        />
      </div>

      <UI.RowBox>
        <FortniteWidget />
        {/* <NewsWidget /> */}
        <div className="flex flex-col p-2 gap-1 min-w-[60%] w-full @max-xl:w-full max-w-full @max-xl:max-w-full bg-neutral-800/10 rounded-xs border-[#2e2e2e] border-1 border-solid overflow-hidden">
          <UI.P>
            <span className="font-[500] font-geist">Recent Matches</span>
          </UI.P>
        </div>
      </UI.RowBox>

      <UI.RowBox>
        <EventsWidget />
        <div className="flex flex-col gap-1 flex-1 min-w-max min-w-50%">
          <UI.Button
            colour="invisible"
            className="text-neutral-500 hover:text-neutral-400 h-full min-h-8"
          >
            View Recent Matches
          </UI.Button>
          <UI.Button
            colour="invisible"
            className="text-neutral-500 hover:text-neutral-400 h-full min-h-8"
          >
            Global Leaderboard
          </UI.Button>
          <UI.Button
            colour="invisible"
            className="text-neutral-500 hover:text-neutral-400 h-full min-h-8"
          >
            Today's Item Shop
          </UI.Button>
          <UI.Button
            colour="invisible"
            className="text-neutral-500 hover:text-neutral-400 h-full min-h-8"
          >
            Support Channel
          </UI.Button>
          <UI.Button
            colour="invisible"
            className="text-neutral-500 hover:text-neutral-400 h-full min-h-8"
          >
            Global Leaderboard
          </UI.Button>
        </div>
      </UI.RowBox>

      <UI.RowBox>
        <NewsWidget />
      </UI.RowBox>
    </>
  );
};

export default HomePage;
