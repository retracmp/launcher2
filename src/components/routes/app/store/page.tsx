import { OptionGroup } from "src/components/routes/app/settings/option";
import UI from "src/components/core/default";
const StorePage = () => {
  return (
    <OptionGroup _first>
      <div className="flex flex-col gap-[0.2rem]">
        <UI.H1 className="font-[300] text-neutral-300">Store</UI.H1>
        <UI.P className="text-neutral-400">
          Consider donating to help fund the development of Retrac. All
          donations go towards server costs, development tools and other
          expenses.
        </UI.P>
      </div>
    </OptionGroup>
  );
};

export default StorePage;
