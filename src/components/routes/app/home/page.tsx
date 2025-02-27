import { useUserManager } from "src/wrapper/user";

import UI from "src/components/core/default";
import CharacterWidget from "src/components/routes/app/home/character";
import StatisticsWidget from "src/components/routes/app/home/statistics";

const HomePage = () => {
  const userManager = useUserManager();
  if (userManager._user == null || userManager._season == null) return null;

  return (
    <>
      <div className="flex flex-row gap-1 p-1.5 pb-0">
        <CharacterWidget user={userManager._user} />
        <StatisticsWidget
          account={userManager._user.Account}
          season={userManager._season}
        />
      </div>

      <UI.ColBox>
        <div className="flex flex-col p-2 gap-1 min-w-max bg-neutral-800/10 rounded-xs border-[#2e2e2e] border-1 border-solid">
          <UI.P>
            <span className="font-[500] font-geist">Recent News</span>
          </UI.P>

          <div className="flex flex-col gap-[2px]">
            <UI.P className="cursor-pointer hover:underline text-neutral-400">
              <span className="text-blue-300 text-[12px]">NEW! </span>
              Update 21/03/2024 -{" "}
              <span className="text-neutral-300">
                Quick Updates to Lategame & Arena.
              </span>
            </UI.P>

            <UI.P className="cursor-pointer hover:underline text-neutral-400">
              Cosmetic Update 17/03/2024 -{" "}
              <span className="text-neutral-300">New Cosmetics & Bundles.</span>
            </UI.P>

            <UI.P className="cursor-pointer hover:underline text-neutral-400">
              Economy Reset 02/03/2024 -{" "}
              <span className="text-neutral-300">
                V-Bucks reward price changes.
              </span>
            </UI.P>

            <p className="font-plex leading-[14px] min-w-max cursor-pointer hover:underline text-neutral-500 text-[12px]">
              View All...
            </p>
          </div>
        </div>
      </UI.ColBox>
    </>
  );
};

export default HomePage;
