import { useState } from "react";
import { useRetrac } from "src/wrapper/retrac";

import UI from "src/components/core/default";
import NumberFlow from "@number-flow/react";

type CharacterWidgetProps = {
  user: User;
  season: number;
};

const CharacterWidget = (props: CharacterWidgetProps) => {
  const online = useRetrac((s) => s.players_online);

  const loadout = Object.values(props.user.profiles.athena.loadouts).find(
    (l) => l.index === 0
  );
  if (loadout == null) return console.error("failed to get loadout") ?? null;

  const character = (() => {
    if (!loadout.characterId.toLowerCase().includes("random")) {
      return (
        props.user.profiles.athena.items[loadout.characterId || ""] || null
      );
    }

    const character_cosmetics = Object.values(
      props.user.profiles.athena.items
    ).filter((x) => x.grant.backendType === "AthenaCharacter");

    const favourited_cosmetics = character_cosmetics.filter(
      (x) => x.attributes["favorite"] === true
    );
    const randomised_list =
      favourited_cosmetics.length > 0
        ? favourited_cosmetics
        : character_cosmetics;

    return randomised_list[Math.floor(Math.random() * randomised_list.length)];
  })() as Item | null;

  if (character == null)
    return console.error("failed to get character") ?? null;

  const template = character.grant.template.replace("_Retrac", "");
  const icon = `https://fortnite-api.com/images/cosmetics/br/${template}/icon.png`;

  const currency = props.user.account.perks["currency"];
  if (currency == null) return console.error("failed to get currency") ?? null;

  const season_level = props.user.account.perks["season_level"];
  if (season_level == null)
    return console.error("failed to get season_level") ?? null;

  return (
    <div className="flex flex-row p-2 gap-2 min-w-max w-[60%] @max-2xl:w-full bg-neutral-800/10 rounded-sm border-neutral-700/40 border-1 border-solid backdrop-blur-sm">
      <div className="flex flex-col w-full gap-1">
        <div className="flex flex-col w-full gap-0.5">
          <UI.P>
            Welcome back,
            <span className="font-bold font-geist">
              {" " + props.user.account.display_name}
            </span>
            .
          </UI.P>
          <UI.P className="text-neutral-500">
            There
            {online === 1 ? " is " : " are "}
            currently
            <span className="font-bold font-geist text-neutral-400">
              {" "}
              {online === 0 ? "no" : <NumberFlow value={online} />}{" "}
            </span>
            {online === 1 ? " player " : " players "}
            online.
          </UI.P>
        </div>

        <div className="flex flex-col flex-1 gap-0.5">
          <div className="flex flex-row w-full items-center gap-2">
            <UI.P className="text-neutral-500">V-Bucks</UI.P>
            <div className="w-full min-w-8 h-[1px] bg-neutral-600/20"></div>
            <UI.P>{currency.toLocaleString()}</UI.P>
          </div>

          <div className="flex flex-row w-full items-center gap-2">
            <UI.P className="text-neutral-500">Season Level</UI.P>
            <div className="w-full min-w-8 h-[1px] bg-neutral-600/20"></div>
            <UI.P>{season_level.toLocaleString()}</UI.P>
          </div>

          <div className="flex flex-row w-full items-center gap-2">
            <UI.P className="text-neutral-500">Arena Hype</UI.P>
            <div className="w-full min-w-8 h-[1px] bg-neutral-600/20"></div>
            <UI.P>
              {(
                (props.user.account.scores["NormalHype"] || 0) +
                (props.user.account.scores["LategameHype"] || 0)
              ).toLocaleString()}
            </UI.P>
          </div>
        </div>
      </div>

      <div className="relative @min-sm:flex items-center justify-center overflow-hidden min-w-max h-full aspect-square ml-auto bg-neutral-900 border-neutral-500/10 border-1 border-solid rounded-xs @max-sm:hidden">
        <CharacterImage url={icon} />
      </div>
    </div>
  );
};

type CharacterImageProps = {
  url: string;
};

const CharacterImage = (props: CharacterImageProps) => {
  const [showFake, setShowFake] = useState(true);

  return (
    <>
      {showFake && (
        <img
          src="/missing.png"
          className="absolute min-w-[114%] h-[114%]"
          draggable={false}
        />
      )}

      <img
        src={props.url}
        className="absolute min-w-[114%] h-[114%] opacity-0"
        draggable={false}
        onLoad={() => setShowFake(false)}
      />

      {!showFake && (
        <img
          src={props.url}
          className="absolute min-w-[114%] h-[114%]"
          draggable={false}
          onError={() => setShowFake(true)}
        />
      )}
    </>
  );
};

export default CharacterWidget;
