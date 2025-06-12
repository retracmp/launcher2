import { useState } from "react";
import { useRetrac } from "src/wrapper/retrac";
import { useUserManager } from "src/wrapper/user";

import UI from "src/components/core/default";
import NumberFlow from "@number-flow/react";

type CharacterWidgetProps = {
  user: User;
  season: number;
};

const CharacterWidget = (props: CharacterWidgetProps) => {
  const donationTier = useUserManager((s) => s.user_best_donation_tier)();

  const online = useRetrac((s) => s.players_online);

  const loadout = props.user.Profiles.athena.Loadouts.find(
    (l) => l.ID === props.user.Profiles.athena.Attributes["loadouts"][0]
  );
  if (loadout == null) return console.error("failed to get loadout") ?? null;

  const character = props.user.Profiles.athena.Items[loadout.CharacterID || ""];
  if (character == null)
    return console.error("failed to get character") ?? null;

  const template = character.Template.replace("_Retrac", "");
  const icon = `https://fortnite-api.com/images/cosmetics/br/${template}/icon.png`;

  const currency = Object.values(props.user.Profiles.common_core.Items).find(
    (i) => i.Template === "MtxPurchased"
  );
  if (currency == null) return console.error("failed to get currency") ?? null;

  const seasonStat = props.user.Account.Stats[props.season];
  if (!seasonStat) return console.error("failed to get account stats") ?? null;

  return (
    <div className="flex flex-row p-2 gap-2 min-w-max w-[60%] @max-2xl:w-full bg-neutral-800/10 rounded-sm border-neutral-700/40 border-1 border-solid backdrop-blur-sm">
      <div className="flex flex-col w-full gap-1">
        <div className="flex flex-col w-full gap-0.5">
          <UI.P>
            Welcome back,
            <span
              className="font-bold font-geist"
              style={donationTier != null ? { color: donationTier.colour } : {}}
            >
              {" " + props.user.Account.DisplayName}
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
            <UI.P>{currency.Quantity.toLocaleString()}</UI.P>
          </div>

          <div className="flex flex-row w-full items-center gap-2">
            <UI.P className="text-neutral-500">Season Level</UI.P>
            <div className="w-full min-w-8 h-[1px] bg-neutral-600/20"></div>
            <UI.P>{seasonStat.LevelClaimed.toLocaleString()}</UI.P>
          </div>

          <div className="flex flex-row w-full items-center gap-2">
            <UI.P className="text-neutral-500">Overall Hype</UI.P>
            <div className="w-full min-w-8 h-[1px] bg-neutral-600/20"></div>
            <UI.P>
              {(
                (seasonStat.PersistentScores["NormalHype"] || 0) +
                (seasonStat.PersistentScores["LategameHype"] || 0)
              ).toLocaleString()}
            </UI.P>
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center overflow-hidden min-w-max h-full aspect-square ml-auto bg-neutral-900 border-neutral-500/10 border-1 border-solid rounded-xs">
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
