import { useBannerManager } from "src/wrapper/banner";

import Banner from "./banner";
import { AnimatePresence, motion } from "motion/react";

const BannerRenderer = () => {
  const banners = useBannerManager((s) => s._banners);
  const bannerValues = Object.values(banners);

  return (
    <div className="flex flex-col px-1.5 pb-0">
      <AnimatePresence>
        {bannerValues.map((banner, index) => (
          <motion.div
            key={banner.id}
            initial={{
              opacity: 0,
              scale: 0.95,
              marginTop: 0,
              height: 0,
              minHeight: 0,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              minHeight: "2.125rem",
              height: "auto",
              marginTop: "0.25rem",
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              height: 0,
              marginTop: 0,
              minHeight: 0,
            }}
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
