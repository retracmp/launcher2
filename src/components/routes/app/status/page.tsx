import { useServerManager } from "src/wrapper/server";

import { OptionGroup } from "src/components/routes/app/settings/option";
import ServerRendered from "src/components/routes/app/status/server";
import UI from "src/components/core/default";

const StatusPage = () => {
  const serverManager = useServerManager();

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

      <OptionGroup _animate title="Loading">
        {serverManager
          .servers_by_status(
            "Initialised",
            "AssignedParties_WaitingForGameserverSocket"
          )
          .map((s) => (
            <ServerRendered server={s} key={s.id} />
          ))}
      </OptionGroup>

      <OptionGroup _animate title="Awaiting Players">
        {serverManager
          .servers_by_status(
            "GameserverConfirmedParties_CanBackfill_WaitingToMatchmake",
            "PlayersMatchmaked_WaitingForBus"
          )
          .map((s) => (
            <ServerRendered server={s} key={s.id} />
          ))}
      </OptionGroup>

      <OptionGroup _animate title="Active">
        {serverManager.servers_by_status("BusStarted_WaitingToEnd").map((s) => (
          <ServerRendered server={s} key={s.id} />
        ))}
      </OptionGroup>
    </>
  );
};

export default StatusPage;
