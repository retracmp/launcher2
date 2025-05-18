import { useServerManager } from "src/wrapper/server";

import { OptionGroup } from "src/components/routes/app/settings/option";
import ServerRendered, {
  NoServers,
} from "src/components/routes/app/status/server";
import UI from "src/components/core/default";

const StatusPage = () => {
  const serverManager = useServerManager();

  const loading = serverManager.servers_by_status(
    "Initialised",
    "AssignedParties_WaitingForGameserverSocket"
  );

  const awaitingPlayers = serverManager.servers_by_status(
    "GameserverConfirmedParties_CanBackfill_WaitingToMatchmake",
    "PlayersMatchmaked_WaitingForBus"
  );

  const active = serverManager.servers_by_status("BusStarted_WaitingToEnd");

  return (
    <>
      <OptionGroup _first>
        <div className="flex flex-col gap-[0.2rem]">
          <UI.H1 className="font-[300] text-neutral-300">Matches</UI.H1>
          <UI.P className="text-neutral-400">
            Currently active game sessions, recent matches and more.
          </UI.P>
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
