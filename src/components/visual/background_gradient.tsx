import { useOptions } from "src/wrapper/options";

const BackgroundGradient = () => {
  const options = useOptions();

  if (options.enable_background_image) return null;
  if (options.background_gradient === "") return null;

  return (
    <div
      className="absolute w-[110%] h-[110%] opacity-100 pointer-events-none z-[-10000] bg-cover bg-center left-[50%] top-[50%] transform-[translate(-50%,-50%)]"
      style={{
        backgroundImage: `${options.background_gradient}`,
        filter: `blur(${options.background_blur}rem)`,
      }}
    ></div>
  );
};

export default BackgroundGradient;
