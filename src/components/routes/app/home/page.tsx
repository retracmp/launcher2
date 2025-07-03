import { useRetrac } from "src/wrapper/retrac";
import { useUserManager } from "src/wrapper/user";

import UI from "src/components/core/default";
import CharacterWidget from "src/components/routes/app/home/widgets/character";
import StatisticsWidget from "src/components/routes/app/home/widgets/statistics";
import FortniteWidget from "src/components/routes/app/home/widgets/fortnite";
import NewsWidget from "src/components/routes/app/home/widgets/news";
import EventsWidget from "src/components/routes/app/home/widgets/events";
import LootLabsWidget from "src/components/routes/app/home/widgets/lootlabs";
import DonateWidget from "src/components/routes/app/home/widgets/donate";
import { OptionGroup } from "../../../core/option";

const HomePage = () => {
  const retrac = useRetrac();
  const userManager = useUserManager();
  if (userManager._user == null || userManager._season == null) return null;

  return (
    <>
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

      {retrac.show_all_widgets && (
        <OptionGroup _row>
          <div className="flex flex-col gap-1 min-w-50">
            <UI.Button colour="invisible" className="h-8">
              Recent Matches
            </UI.Button>
            <UI.Button colour="invisible" className="h-8">
              News & Updates
            </UI.Button>
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <DonateWidget />
          </div>
        </OptionGroup>
      )}

      {retrac.show_all_widgets && (
        <UI.RowBox>
          <EventsWidget />
          <NewsWidget />
        </UI.RowBox>
      )}
    </>
  );
};

export default HomePage;
