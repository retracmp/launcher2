import UI from "src/components/core/default";

type CharacterWidgetProps = {
  user: User;
};

const CharacterWidget = (props: CharacterWidgetProps) => {
  const loadout = props.user.Profiles.athena.Loadouts.find(
    (l) => l.ID === props.user.Profiles.athena.Attributes["loadouts"][0]
  );
  if (loadout == null) return null;

  const character = props.user.Profiles.athena.Items[loadout.CharacterID || ""];
  if (character == null) return null;

  const template = character.Template.replace("_Retrac", "");
  const icon = `https://fortnite-api.com/images/cosmetics/br/${template}/icon.png`;

  return (
    <div className="flex flex-row p-2 gap-2 w-[60%] min-w-max bg-neutral-800/10 rounded-xs border-[#2e2e2e] border-1 border-solid">
      <div className="flex flex-col flex-1">
        <UI.P>
          Welcome back,
          <span className="font-bold font-geist">
            {" " + props.user.Account.DisplayName}
          </span>
          .
        </UI.P>
      </div>

      <div className="relative flex items-center justify-center overflow-hidden h-full aspect-square ml-auto bg-neutral-900 border-neutral-500/10 border-1 border-solid rounded-xs">
        <img
          src={icon}
          className="absolute min-w-[114%] h-[114%]"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default CharacterWidget;
