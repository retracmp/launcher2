import { useDownloadState } from "src/wrapper/download";

import { OptionGroup } from "src/components/core/option";
import DownloadingBuild from "./downloading";
// import { SimpleUI } from "src/import/ui";

const DownloadsPage = () => {
  const downloadState = useDownloadState();

  return (
    <div className="flex flex-1 flex-row">
      {/* <SimpleUI.Drawer
        state={SimpleUI.DrawerState.Expanded}
        items={{
          top: [
            {
              label: "Active Downloads",
              clicked: {
                type: "LINK",
                href: "/downloads",
              },
              icon: "IoCloudDownload",
            },
          ],
          bottom: [],
        }}
      /> */}

      <div className="flex flex-1 flex-col gap-1">
        {downloadState.active_download_progress.size > 0 && (
          <OptionGroup>
            {Array.from(downloadState.active_download_progress.entries()).map(
              ([key, value]) => (
                <DownloadingBuild key={key} progress={value} />
              )
            )}
          </OptionGroup>
        )}
      </div>
    </div>
  );
};

export default DownloadsPage;
