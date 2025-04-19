import { useUserManager } from "src/wrapper/user";
import { useRouterState } from "@tanstack/react-router";

import { AnimatePresence } from "motion/react";
import UI from "src/components/core/default";
import CharacterWidget from "src/components/routes/app/home/widgets/character";
import StatisticsWidget from "src/components/routes/app/home/widgets/statistics";
import FortniteWidget from "src/components/routes/app/home/widgets/fortnite";
// import NewsWidget from "src/components/routes/app/home/widgets/news";
// import EventsWidget from "src/components/routes/app/home/widgets/events";
import LootLabsWidget from "src/components/routes/app/home/widgets/lootlabs";
// import DonateWidget from "src/components/routes/app/home/widgets/donate";
import RecentMatchesPage from "./matches";
// import RecentMatchesWidget from "src/components/routes/app/home/widgets/matches";

const HomePage = () => {
  // const navigate = useNavigate();
  const router = useRouterState();

  const userManager = useUserManager();
  if (userManager._user == null || userManager._season == null) return null;

  return (
    <>
      <AnimatePresence>
        {router.location.pathname === "/app/matches" && (
          <RecentMatchesPage key="recent-matches" />
        )}
      </AnimatePresence>
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

      {/* <UI.RowBox>
        <div className="flex flex-col gap-1 min-w-50">
          <UI.Button
            colour="invisible"
            className="h-8"
            onClick={() => {
              console.log("navigate to matches");
              navigate({
                to: "/app/matches",
              });
            }}
          >
            Recent Matches
          </UI.Button>
          <UI.Button colour="invisible" className="h-8">
            News & Updates
          </UI.Button>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <DonateWidget />
        </div>
      </UI.RowBox> */}
    </>
  );
};

export default HomePage;
