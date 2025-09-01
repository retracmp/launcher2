import { useRetrac } from "src/wrapper/retrac";
import { useUserManager } from "src/wrapper/user";

import { OptionGroup } from "../../../core/option";
import CharacterWidget from "src/components/routes/app/home/widgets/character";
import StatisticsWidget from "src/components/routes/app/home/widgets/statistics";
import FortniteWidget from "src/components/routes/app/home/widgets/fortnite";
import NewsWidget from "src/components/routes/app/home/widgets/news";
import EventsWidget from "src/components/routes/app/home/widgets/events";
import LootLabsWidget from "src/components/routes/app/home/widgets/lootlabs";
import DonateWidget from "src/components/routes/app/home/widgets/donate";
import NewsModalParent from "./widgets/news_modal";

const HomePage = () => {
  const retrac = useRetrac();
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
        <StatisticsWidget
          account={userManager._user.Account}
          season={userManager._season}
        />
      </OptionGroup>

      <OptionGroup _row title="Play Retrac">
        <FortniteWidget />
        <LootLabsWidget />
      </OptionGroup>

      <OptionGroup _row title="New & Upcoming">
        <NewsWidget />
      </OptionGroup>

      {retrac.show_all_widgets && (
        <OptionGroup _row title="Todo">
          <EventsWidget />
          <DonateWidget />
        </OptionGroup>
      )}
    </>
  );
};

export default HomePage;
