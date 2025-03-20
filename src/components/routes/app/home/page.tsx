import { useUserManager } from "src/wrapper/user";

import UI from "src/components/core/default";
import CharacterWidget from "src/components/routes/app/home/widgets/character";
import StatisticsWidget from "src/components/routes/app/home/widgets/statistics";
import FortniteWidget from "src/components/routes/app/home/widgets/fortnite";
// import NewsWidget from "src/components/routes/app/home/widgets/news";
// import EventsWidget from "src/components/routes/app/home/widgets/events";
import LootLabsWidget from "src/components/routes/app/home/widgets/lootlabs";
// import RecentMatchesWidget from "src/components/routes/app/home/widgets/matches";
import DonateWidget from "src/components/routes/app/home/widgets/donate";

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
        <LootLabsWidget />
      </UI.RowBox>

      <div className="flex flex-1 p-1.5">
        <DonateWidget />
      </div>
    </>
  );
};

export default HomePage;
