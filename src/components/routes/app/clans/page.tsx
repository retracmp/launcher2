import UI from "src/components/core/default";
import { OptionGroup } from "src/components/core/option";

const ClansPage = () => {
  return (
    <>
      <OptionGroup _first>
        <div className="flex flex-col gap-[0.2rem]">
          <UI.H1 className="font-[300] text-neutral-300">Clans</UI.H1>
          <UI.P className="text-neutral-400">Work in progress</UI.P>
        </div>
      </OptionGroup>
    </>
  );
};

export default ClansPage;
