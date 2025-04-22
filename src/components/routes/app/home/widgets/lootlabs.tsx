import { useMemo, useEffect, useState } from "react";
import { useUserManager } from "src/wrapper/user";
import { openUrl } from "@tauri-apps/plugin-opener";
import { motion } from "motion/react";
import client from "src/axios/client";

import UI from "src/components/core/default";
import { formatTime } from "src/helpers/time";

const LootLabsWidget = () => {
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

    const link = await client.get_lootlabs_offer_url(user._token);
    if (link.ok) {
      openUrl(link.data);
    }
  };

  return (
    <div className="relative flex flex-col p-2 gap-0.5 w-[70%] @max-xl:w-[100%] @max-xl:h-40 bg-neutral-800/10 rounded-sm border-[#2e2e2e] border-1 border-solid">
      <UI.H1 className="z-20">Looking for more?</UI.H1>
      <UI.P className="z-20">
        Receive a gift package of V-Bucks every hour, for completely free! All
        you have to do is complete a simple offer from our sponsors.
      </UI.P>

      <div
        className="absolute top-0 left-0 w-full h-full bg-center bg-cover overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(65% 80% at 50% 0%, #ff9b0b25 0%, #00000000 100%)",
        }}
      >
        <RainingVBucks />
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

const RainingVBucks = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
      {Array.from({ length: 50 }).map((_, idx) => (
        <VBuck key={idx} />
      ))}
    </div>
  );
};

const VBuck = () => {
  const props = useMemo(() => {
    const size = Math.random() * 1 + 1;
    const left = Math.random() * 100;
    const duration = Math.random() * 5 + 15;
    const delay = Math.random() * -20;
    const rotation = Math.random() * 360 - 90;

    return { size, left, duration, delay, rotation };
  }, []);

  return (
    <motion.div
      initial={{
        y: "-10vh",
        rotate: 0,
        // opacity: 0,
      }}
      animate={{
        y: "110vh",
        rotate: props.rotation,
        // opacity: [0, 0.6, 0],
      }}
      transition={{
        duration: props.duration,
        delay: props.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        position: "absolute",
        top: 0,
        left: `${props.left}%`,
        height: `${props.size}rem`,
        width: `${props.size}rem`,
        backgroundImage: "url(/vbuck.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        pointerEvents: "none",
        filter: "brightness(0.4)",
      }}
    />
  );
};

export default LootLabsWidget;
