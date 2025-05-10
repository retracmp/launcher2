import { useDownloadState } from "src/wrapper/download";

import { OptionGroup } from "src/components/routes/app/settings/option";
import UI from "src/components/core/default";
import DownloadingBuild from "./downloading";
import DownloadEntry from "./entry";

const DownloadsPage = () => {
  const downloadState = useDownloadState();

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

      {downloadState.active_progress.size > 0 && (
        <OptionGroup title="Active Downloads">
          {Array.from(downloadState.active_progress.entries()).map(
            ([key, value]) => (
              <DownloadingBuild key={key} progress={value} />
            )
          )}
        </OptionGroup>
      )}

      <OptionGroup title="Available" _last _animate>
        <DownloadEntry
          manifestInfo={{
            title: "Chapter 2 Season 4",
            manifestId: "++Fortnite+Release-14.40-CL-14550713-Windows",
            imageUrl: "/c2s4_keyart.jpg",
            iconUrl: "/c2s4_icon.jpg",
            gigabyteSize: 32.0,
          }}
        />

        <DownloadEntry
          manifestInfo={{
            title: "Season 1",
            manifestId: "++Fortnite+Release-1.8-CL-3724489-Windows",
            imageUrl: "/c1s1_keyart.jpg",
            iconUrl: "/c1s1_icon.jpg",
            gigabyteSize: 32.0,
          }}
        />
      </OptionGroup>
    </>
  );
};

export default DownloadsPage;
