import { useUserManager } from "src/wrapper/user";

import UI from "src/components/core/default";
import CharacterWidget from "src/components/routes/app/home/widgets/character";
import StatisticsWidget from "src/components/routes/app/home/widgets/statistics";
import FortniteWidget from "src/components/routes/app/home/widgets/fortnite";
import NewsWidget from "src/components/routes/app/home/widgets/news";
import PanelWidget from "src/components/routes/app/home/widgets/panels";

const HomePage = () => {
  const userManager = useUserManager();
  if (userManager._user == null || userManager._season == null) return null;

  return (
    <>
      <div className="flex flex-row gap-1 p-1.5 pb-0">
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
        <NewsWidget />
      </UI.RowBox>

      <UI.RowBox>
        <PanelWidget />
      </UI.RowBox>
    </>
  );
};

export default HomePage;
