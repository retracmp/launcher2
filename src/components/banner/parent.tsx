import { useBannerManager } from "src/wrapper/banner";
import Banner from "./banner";

const BannerRenderer = () => {
  const banners = useBannerManager((s) => s._banners);
  if (!banners || Object.keys(banners).length === 0) return null;

  return (
    // <div className="flex flex-col gap-1 p-1.5 border-b-[#2e2e2e] border-b-1 border-solid">
    <div className="flex flex-col gap-1 p-1.5 pb-0">
      {Object.values(banners).map((banner, index) => (
        <Banner key={index} {...banner} />
      ))}
    </div>
  );
};

export default BannerRenderer;
