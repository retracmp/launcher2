import { useDownloadState } from "src/wrapper/download";
import { useRetrac } from "src/wrapper/retrac";

import { OptionGroup } from "src/components/routes/app/settings/option";
import UI from "src/components/core/default";
import DownloadingBuild from "./downloading";
import DownloadEntry from "./entry";

const DownloadsPage = () => {
  const downloadState = useDownloadState();
  const manifestInformation = useRetrac((s) => s.manifests);

  return (
    <>
      <OptionGroup _first>
        <div className="flex flex-col gap-[0.2rem]">
          <UI.H1 className="font-[300] text-neutral-300">Downloads</UI.H1>
          <UI.P className="text-neutral-400">
            Find and download new build here hosted from our servers. You can
            also verify and repair your existing builds.
          </UI.P>
        </div>
      </OptionGroup>

      {downloadState.active_download_progress.size > 0 && (
        <OptionGroup title="Active Downloads">
          {Array.from(downloadState.active_download_progress.entries()).map(
            ([key, value]) => (
              <DownloadingBuild key={key} progress={value} />
            )
          )}
        </OptionGroup>
      )}

      <OptionGroup title="Available" _last _animate>
        {manifestInformation.map((manifestInfo) => {
          return (
            <DownloadEntry
              manifestInfo={manifestInfo}
              key={manifestInfo.manifestId}
            />
          );
        })}
      </OptionGroup>
    </>
  );
};

export default DownloadsPage;
