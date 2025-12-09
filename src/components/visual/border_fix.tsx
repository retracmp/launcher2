import { useApplicationInformation } from "src/wrapper/tauri";
import { twJoin } from "tailwind-merge";

const Windows10BorderFix = () => {
  const application = useApplicationInformation();

  return (
    <div
      className={twJoin(
        "w-full z-[99999] h-[1px]",
        application.windowsVersion < 22000 && "bg-[#303030]"
      )}
    ></div>
  );
};

export default Windows10BorderFix;
