import { useUserManager } from "src/wrapper/user";

import { OptionGroup } from "../../../core/option";
import CharacterWidget from "src/components/routes/app/home/widgets/character";
import StatisticsWidget from "src/components/routes/app/home/widgets/statistics";
import FortniteWidget from "src/components/routes/app/home/widgets/fortnite";
import LootLabsWidget from "src/components/routes/app/home/widgets/lootlabs";
import NewsModalParent from "./widgets/news_modal";

const HomePage = () => {
  const userManager = useUserManager();
  if (userManager._user == null || userManager._season == null) return null;

  return (
    <>
      <NewsModalParent />

      <OptionGroup _first _row>
        <CharacterWidget
          user={userManager._user}
          season={userManager._season}
        />
        <StatisticsWidget />
      </OptionGroup>

      <OptionGroup _row title="Play Retrac">
        <FortniteWidget />
        <LootLabsWidget />
      </OptionGroup>

      {/* <OptionGroup _row title="New & Upcoming">
        <NewsWidget />
      </OptionGroup>

      {retrac.show_all_widgets && (
        <OptionGroup _row title="Todo">
          <DonateWidget />
        </OptionGroup>
      )} */}
    </>
  );
};

export default HomePage;
