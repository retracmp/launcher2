import { OptionGroup } from "src/components/routes/app/settings/option";
import UI from "src/components/core/default";

const LibraryPage = () => {
  return (
    <>
      <OptionGroup _first>
        <div className="flex flex-col gap-[0.2rem]">
          <UI.H1 className="font-[300] text-neutral-300">Library</UI.H1>
          <UI.P className="text-neutral-400">
            Manage installed versions, update content patches and more.
          </UI.P>
        </div>
      </OptionGroup>
    </>
  );
};

export default LibraryPage;
