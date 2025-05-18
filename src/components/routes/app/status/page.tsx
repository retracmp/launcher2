import { useRetrac } from "src/wrapper/retrac";
import { useServerManager } from "src/wrapper/server";

import { OptionGroup } from "src/components/routes/app/settings/option";
import ServerRendered, {
  NoServers,
} from "src/components/routes/app/status/server";
import { IoListSharp } from "react-icons/io5";
import UI from "src/components/core/default";

import RecentMatchesParent from "./matches";
import FiltersParent from "./filters";

const StatusPage = () => {
  const serverManager = useServerManager();
  const retrac = useRetrac();

  const loading = serverManager.servers_by_status(
    "Initialised",
    "AssignedParties_WaitingForGameserverSocket"
  );

  const awaitingPlayers = serverManager.servers_by_status(
    "GameserverConfirmedParties_CanBackfill_WaitingToMatchmake",
    "PlayersMatchmaked_WaitingForBus"
  );

  const active = serverManager.servers_by_status("BusStarted_WaitingToEnd");

  const hasEnabledSomeFilters =
    !serverManager.show_eu_servers || !serverManager.show_na_servers;

  return (
    <>
      <RecentMatchesParent />
      <FiltersParent />

      <OptionGroup _first>
        <div className="flex flex-col gap-[0.2rem]">
          <UI.H1 className="font-[300] text-neutral-300">Matches</UI.H1>
          <UI.P className="text-neutral-400">
            Currently active game sessions, recent matches and more.
          </UI.P>
        </div>
      </OptionGroup>

      <OptionGroup title="Actions">
        <div className="flex flex-row gap-1">
          <UI.Button
            colour="invisible"
            className="py-0 px-2 mt-auto z-10 w-min gap-0"
            onClick={() => retrac.set_show_recent_matches(true)}
          >
            <span className="text-neutral-400">Recent Matches</span>
          </UI.Button>
          <UI.Button
            colour="invisible"
            className="py-0 px-2 mt-auto z-10 w-min gap-0"
            onClick={() => retrac.set_show_filters(true)}
          >
            <IoListSharp className="text-neutral-400 w-4 h-4" />
            <span className="text-neutral-400">Filters</span>
            {hasEnabledSomeFilters && (
              <span className="bg-neutral-400 rounded-full w-1 h-1" />
            )}
          </UI.Button>
        </div>
      </OptionGroup>

      <OptionGroup _animate title="Loading" _hideable>
        {loading.map((s) => (
          <ServerRendered server={s} key={s.id} />
        ))}

        {loading.length === 0 && <NoServers />}
      </OptionGroup>

      <OptionGroup _animate title="Awaiting Players" _hideable>
        {awaitingPlayers.map((s) => (
          <ServerRendered server={s} key={s.id} />
        ))}

        {awaitingPlayers.length === 0 && <NoServers />}
      </OptionGroup>

      <OptionGroup _animate title="Active" _hideable>
        {active.map((s) => (
          <ServerRendered server={s} key={s.id} />
        ))}

        {active.length === 0 && <NoServers />}
      </OptionGroup>
    </>
  );
};

export default StatusPage;
