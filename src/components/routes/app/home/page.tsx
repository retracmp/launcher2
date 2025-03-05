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
      </UI.RowBox>

      <UI.RowBox>
        <EventsWidget />
        {/* <div className="flex flex-col gap-2 flex-1 min-w-max">
          <UI.Button colour="invisible">asd</UI.Button>
        </div> */}
      </UI.RowBox>

      <UI.RowBox>
        <NewsWidget />
      </UI.RowBox>
    </>
  );
};

export default HomePage;
