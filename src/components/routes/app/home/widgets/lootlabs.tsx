import { useEffect, useState } from "react";
import { useUserManager } from "src/wrapper/user";
import { endpoints_config } from "src/axios/endpoints";
import { useApplicationInformation } from "src/wrapper/tauri";
import { openUrl } from "@tauri-apps/plugin-opener";

import UI from "src/components/core/default";
import { formatTime } from "src/helpers/time";
import { SimpleUI } from "src/import/ui";

const LootLabsWidget = () => {
  const application = useApplicationInformation();

  const user = useUserManager();
  if (user._user === null)
    return (
      console.error("cannot load loot labs widget: user._user = null") ?? null
    );

  const claimed = user._user.Account.State.ClaimedPackages["lootlabs_1kvbucks"];
  const difference = new Date().getTime() - new Date(claimed || 0).getTime();
  const disabled = difference < 24 * 60 * 60 * 1000;

  const [originalText, setOriginalText] = useState(
    formatTime(24 * 60 * 60 * 1000 - difference)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setOriginalText(formatTime(24 * 60 * 60 * 1000 - difference));
    }, 1000);

    return () => clearInterval(interval);
  }, [difference]);

  const handleClaimOffer = async () => {
    if (user._token === null)
      return console.error("No token found, so cannot claim the link");

    const endpoints = endpoints_config(application);
    await openUrl(endpoints.fiscal_advert_endpoint);
  };

  return (
    <div className="relative flex flex-col p-2 gap-0.5 w-[70%] @max-2xl:w-[100%] @max-2xl:h-40 aspect-[5/2.4] bg-neutral-800/10 rounded-sm border-neutral-700/40 border-1 border-solid backdrop-blur-sm">
      <UI.H1 className="z-20">Looking for more?</UI.H1>
      <UI.P className="z-20">
        Receive a gift package of V-Bucks every hour, for completely free! All
        you have to do is complete a simple offer from our sponsors.
      </UI.P>

      <div
        className="absolute top-0 left-0 w-full h-full bg-center bg-cover overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(65% 80% at 50% 0%, #f9317125 0%, #00000000 100%)",
        }}
      >
        <SimpleUI.FallingElements
          density={50}
          element={() => (
            <SimpleUI.FallingElementContainer
              element={() => (
                <img
                  className="w-full h-full select-none"
                  src="/vbuck.png"
                ></img>
              )}
              size_scale_min={0.8}
              size_scale_max={1.1}
            />
          )}
        />
      </div>

      {!disabled ? (
        <UI.Button
          colour="neutral"
          className="p-1.5 py-1 mt-auto backdrop-blur-2xl z-20 pointer-events-auto"
          onClick={handleClaimOffer}
          disabled={disabled}
        >
          <span className="text-neutral-300">Claim your reward now!</span>
        </UI.Button>
      ) : (
        <UI.Button
          colour="neutral"
          className="p-1.5 mt-auto bg-neutral-800 backdrop-blur-2xl z-10 hover:bg-neutral-800/50"
          disabled
          style={{
            cursor: "not-allowed",
          }}
        >
          <span className="text-neutral-400">
            Offer refreshes in {originalText}!
          </span>
        </UI.Button>
      )}
    </div>
  );
};
export default LootLabsWidget;
