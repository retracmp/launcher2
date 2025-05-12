import { useBannerManager } from "src/wrapper/banner";

import Banner from "./banner";
import { AnimatePresence, motion } from "motion/react";

const BannerRenderer = () => {
  const banners = useBannerManager((s) => s._banners);
  if (!banners || Object.keys(banners).length === 0) return null;

  return (
    <div className="flex flex-col p-1.5 pb-0">
      <AnimatePresence>
        {Object.values(banners).map((banner, index) => (
          <motion.div
            key={banner.id}
            initial={{
              opacity: 0,
              scale: 0.95,
              marginTop: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              height: "2.125rem",
              marginTop: index > 0 ? "0.25rem" : "0",
            }}
            exit={{ opacity: 0, scale: 0.95, height: 0, marginTop: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 21 }}
            className="overflow-hidden"
          >
            <Banner key={index} {...banner} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default BannerRenderer;
