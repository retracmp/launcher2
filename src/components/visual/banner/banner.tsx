import { BannerT, bannerColours, useBannerManager } from "src/wrapper/banner";
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

const Banner = (banner: BannerT) => {
  const close = useBannerManager((s) => s.remove);
  const navigate = useNavigate();

  useEffect(() => {
    if (banner.expireAfter) {
      const timer = setTimeout(() => {
        close(banner.id);
      }, banner.expireAfter * 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <section
      className={`${bannerColours[banner.colour][0]} ${
        banner.link
          ? "cursor-pointer active:scale-[0.99] transition-transform duration-100 ease-in-out"
          : ""
      }`}
      onClick={() =>
        banner.link &&
        (() => {
          navigate({
            to: banner.link,
          });
          close(banner.id);
        })()
      }
    >
      <p className={bannerColours[banner.colour][1]}>{banner.text}</p>
      {banner.closable && (
        <button
          className={`flex items-center justify-center ml-auto p-0.5 rounded-xs cursor-pointer ${
            bannerColours[banner.colour][2]
          } outline-none`}
          onClick={() => close(banner.id)}
        >
          <IoCloseSharp />
        </button>
      )}
    </section>
  );
};

export default Banner;
