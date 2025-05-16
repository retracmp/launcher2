import { useMemo } from "react";
import { motion } from "motion/react";

const Effect = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
      {Array.from({ length: 100 }).map((_, idx) => (
        <FaillingItem key={idx} />
      ))}
    </div>
  );
};
const IMAGES = [
  "/donate/carti.webp",
  "/donate/gamer.webp",
  "/donate/crystal.webp",
  "/donate/fncs.webp",
  "/donate/og.webp",
];

const FaillingItem = () => {
  const props = useMemo(() => {
    const size = Math.random() * 1 + 1;
    const left = Math.random() * 100;
    const duration = Math.random() * 5 + 25;
    const delay = Math.random() * -20;
    const rotation = Math.random() * 360 - 90;
    const image = IMAGES[Math.floor(Math.random() * IMAGES.length)];

    return { size, left, duration, delay, rotation, bg: `url(${image})` };
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
        // backgroundImage: "url(/vbuck.png)",
        backgroundImage: props.bg,
        backgroundSize: "cover",
        backgroundPosition: "center",
        pointerEvents: "none",
        borderRadius: "50%",
        filter: "brightness(0.4) blur(1px)",
        opacity: 0.2,
      }}
    />
  );
};

export default Effect;
