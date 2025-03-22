import { MutableRefObject, useEffect, useRef } from "react";
import { DONATION_TIERS, useUserManager } from "src/wrapper/user";
import { openUrl } from "@tauri-apps/plugin-opener";

import UI from "src/components/core/default";

const DonateWidget = () => {
  const user = useUserManager();
  if (user._user === null)
    return (
      console.error("cannot load donate widget: user._user == null") ?? null
    );
  if (user.user_best_donation_tier() === null) return <NotDonatedMessage />;
  return <DonatedMessage entry={user.user_best_donation_tier()!} />;
};

type DonatedMessageProps = {
  entry: (typeof DONATION_TIERS)[keyof typeof DONATION_TIERS];
};

const DonatedMessage = (type: DonatedMessageProps) => {
  return (
    <div
      className="flex flex-row gap-1 w-full min-h-min h-full p-2 bg-neutral-800/10 rounded-xs border-[#2e2e2e] border-1 border-solid text-center items-center justify-center"
      style={{
        backgroundColor: `${type.entry.colour}10`,
        borderColor: `${type.entry.colour}20`,
      }}
    >
      <UI.P className="text-neutral-300">
        {type.entry.text} Perks are activated and are available for you to use!
      </UI.P>
    </div>
  );
};

const NotDonatedMessage = () => {
  const widgetReference = useRef<HTMLDivElement>(
    null
  ) as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    if (widgetReference.current === null) return;

    widgetReference.current.animate(
      [
        {
          filter: "hue-rotate(0deg)",
        },
        {
          filter: "hue-rotate(360deg)",
        },
      ],
      {
        duration: 100000,
        iterations: Infinity,
        easing: "linear",
      }
    );
  }, [widgetReference]);

  return (
    <div
      className="flex flex-row flex-wrap gap-1 w-full min-h-min h-full p-2 bg-neutral-800/10 rounded-xs border-[#2e2e2e] border-1 border-solid hover:underline cursor-pointer text-neutral-300/60 text-center items-center justify-center"
      style={{
        backgroundImage:
          "linear-gradient(to right, #43e97b30 0%, #38f9d730 100%)",
        borderColor: "#43e97b30",
      }}
      ref={widgetReference}
      onClick={() => openUrl("https://shop.retrac.site")}
    >
      <UI.P className="text-neutral-300">
        Considered Donating?{" "}
        <span className="text-neutral-300/60">
          Every donation to Retrac helps fund servers for the community!
        </span>
      </UI.P>
    </div>
  );
};

export default DonateWidget;
