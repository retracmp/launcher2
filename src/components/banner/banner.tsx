import { BannerT, bannerColours, useBannerManager } from "src/wrapper/banner";
import { IoCloseSharp } from "react-icons/io5";

const Banner = (banner: BannerT) => {
  const close = useBannerManager((s) => s.remove);

  return (
    <section className={bannerColours[banner.colour][0]}>
      <p className={bannerColours[banner.colour][1]}>{banner.text}</p>
      {banner.closable && (
        <button
          className="flex items-center justify-center ml-auto p-0.5 rounded-xs cursor-pointer text-yellow-200 hover:bg-yellow-500/20 outline-none"
          onClick={() => close(banner.id)}
        >
          <IoCloseSharp />
        </button>
      )}
    </section>
  );
};

export default Banner;
