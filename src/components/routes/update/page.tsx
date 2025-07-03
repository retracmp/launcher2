import { useEffect } from "react";
import { useBannerManager } from "src/wrapper/banner";
import { useApplicationInformation } from "src/wrapper/tauri";
import { relaunch } from "@tauri-apps/plugin-process";

import { OptionGroup } from "../../core/option";
import UI from "src/components/core/default";

const UpdatePage = () => {
  const banners = useBannerManager();

  useEffect(() => {
    banners.remove("update");
  }, []);

  const application = useApplicationInformation();
  if (application.updateNeeded === null) return null;

  const update = async () => {
    if (application.updateNeeded === null) return null;
    await application.updateNeeded.downloadAndInstall();
    await relaunch();
  };

  return (
    <>
      <OptionGroup _first>
        <div className="flex flex-col gap-[0.2rem]">
          {/* <UI.H1 className="font-[300] text-neutral-300">
            Launcher Update Available
          </UI.H1> */}
          <UI.P className="text-neutral-400">
            A new version of the launcher is available. Please update to get the
            latest features and bug fixes.
          </UI.P>
          <UI.P className="text-xs text-neutral-500">
            Raw Build {application.updateNeeded.rid}
          </UI.P>
        </div>
      </OptionGroup>

      <OptionGroup
        title={`Download Version ${application.updateNeeded.version}`}
      >
        <UI.Button colour="discord" onClick={update}>
          Update Now
        </UI.Button>
      </OptionGroup>
    </>
  );
};

export default UpdatePage;
