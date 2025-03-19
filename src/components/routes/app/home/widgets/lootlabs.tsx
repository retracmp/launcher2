import { MutableRefObject, useEffect, useRef } from "react";
import UI from "src/components/core/default";

const LootLabsWidget = () => {
  return (
    <div className="relative flex flex-col p-2 gap-0.5 w-[70%] bg-neutral-800/10 rounded-xs border-[#2e2e2e] border-1 border-solid">
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
        <RainingEmojis />
      </div>

      <UI.Button
        colour="neutral"
        className="p-1.5 mt-auto z-10 backdrop-blur-2xl"
      >
        <UI.P className="text-neutral-300">
          <span className="font-[500]">Claim Now</span>
        </UI.P>
      </UI.Button>
    </div>
  );
};

const RainingEmojis = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full">
      {[...Array(40)].map((_, idx) => (
        <Emoji key={idx} />
      ))}
    </div>
  );
};

const Emoji = () => {
  const reference =
    useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>;
  const size = Math.random() * 1 + 1;

  useEffect(() => {
    if (!reference.current) return;

    const offset = Math.random() * 100;

    reference.current.animate(
      [
        {
          opacity: 0,
          top: "-10%",
          left: `${offset}%`,
        },
        {
          opacity: 0.2,
          left: `${offset + 5}%`,
        },
        {
          opacity: 0.3,
          left: `${offset}%`,
        },
        {
          opacity: 0.2,
          left: `${offset + 5}%`,
        },
        {
          top: "100%",
          left: `${offset}%`,
          opacity: 0,
        },
      ],
      {
        duration: Math.random() * 500 + 10000,
        easing: "ease-in-out",
        iterations: Infinity,
        delay: Math.random() * 50000,
      }
    );
  }, [reference]);

  return (
    <div
      className="absolute"
      ref={reference}
      style={{
        height: `${size}rem`,
        width: `${size}rem`,
        backgroundImage: "url(/vbuck.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0,
      }}
    ></div>
  );
};
export default LootLabsWidget;
