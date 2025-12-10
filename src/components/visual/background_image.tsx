import { convertFileSrc } from "@tauri-apps/api/core";
import { useOptions } from "src/wrapper/options";

const BackgroundImage = () => {
  const options = useOptions();
  if (!options.enable_background_image) return null;

  return (
    <div
      className="absolute w-[110%] h-[110%] opacity-40 pointer-events-none z-[-10000] bg-cover bg-center left-[50%] top-[50%] transform-[translate(-50%,-50%)]"
      style={{
        backgroundImage: `url(${
          convertFileSrc(options.background_image) || "/bg2.jpg"
        })`,
        filter: `blur(${options.background_blur}rem)`,
      }}
    ></div>
  );
};

export default BackgroundImage;
