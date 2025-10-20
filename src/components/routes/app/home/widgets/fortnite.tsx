import { useEffect, useRef, useState } from "react";
import { LAUNCH_STATE, useLibrary } from "src/wrapper/library";
import { useNavigate } from "@tanstack/react-router";
import { useDownloadState } from "src/wrapper/download";

import UI from "src/components/core/default";

const IMAGES = [
  "https://d1lss44hh2trtw.cloudfront.net/assets/article/2020/08/27/fortnite-chapter-2-season-4-marvel_feature.jpg",
  "https://fortniteinsider.com/wp-content/uploads/2020/08/Fortnite-Chapter-2-Season-4-Battle-Pass-Skins.jpg",
];

export const VER = "++Fortnite+Release-14.40-CL-14550713";
// const VER = "++Fortnite+Release-Live-CL-3724489";

const FortniteWidget = () => {
  const navigate = useNavigate();
  const library = useLibrary();

  const downloadState = useDownloadState();
  const isAnyDownloadActive = downloadState.active_download_progress.size > 0;

  const imageIndex = new Date().getMinutes() % IMAGES.length;

  const hasSeason14Downloaded =
    library.library.find((x) => x.version === VER) !== undefined;
  const buildLaunched = library.launchState === LAUNCH_STATE.LAUNCHED;
  const buildLaunching = library.launchState === LAUNCH_STATE.LAUNCHING;

  return (
    <div className="relative flex flex-col p-2 gap-0.5 min-w-[45%] w-[70%] @max-2xl:w-[100%] @max-2xl:aspect-[5/2] @max-sm:aspect-[5/3] bg-neutral-800/10 rounded-sm border-neutral-700/40 border-1 border-solid overflow-hidden backdrop-blur-sm min-h-max">
      <UI.H1 className="z-20">Chapter 2 Season 4</UI.H1>

      <UI.P className="text-neutral-400 max-w-0 mb-2 z-10">
        Also known as
        <span className="text-neutral-300"> Stark Season </span> was the
        fourteenth season which started on August 27th 2020, and ended on
        December 1st 2020.
      </UI.P>

      {!hasSeason14Downloaded &&
        !buildLaunched &&
        !buildLaunching &&
        !isAnyDownloadActive && (
          <UI.Button
            colour="blue"
            className="p-1.5 py-1 mt-auto z-10 backdrop-blur-2xl"
            onClick={() => navigate({ to: "/app/downloads" })}
          >
            <span className="text-neutral-300">Download Now</span>
          </UI.Button>
        )}

      {!buildLaunching &&
        !buildLaunched &&
        hasSeason14Downloaded &&
        !isAnyDownloadActive && (
          <UI.Button
            colour="green"
            className="p-1.5 mt-auto z-10 backdrop-blur-2xl cursor-not-allowed"
            onClick={() => library.launchBuild(VER, null)}
          >
            <span className="text-neutral-300">Launch Game</span>
          </UI.Button>
        )}

      {buildLaunching && (
        <UI.Button
          colour="green"
          className="p-1.5 mt-auto z-10 backdrop-blur-2xl cursor-not-allowed"
          disabled
          style={{
            cursor: "not-allowed",
          }}
        >
          {isAnyDownloadActive ? (
            <>
              <UI.LoadingSpinner />
              <span className="text-neutral-400">Download in Progress</span>
            </>
          ) : (
            <>
              {buildLaunching && <UI.LoadingSpinner />}{" "}
              <span className="text-neutral-300/50">Launching Game</span>
            </>
          )}
        </UI.Button>
      )}

      {!buildLaunching && !buildLaunched && isAnyDownloadActive && (
        <UI.Button
          colour="neutral"
          className="p-1.5 mt-auto z-10 backdrop-blur-2xl cursor-not-allowed"
          disabled
        >
          <UI.LoadingSpinner />
          <span className="text-neutral-400">Download in Progress</span>
        </UI.Button>
      )}

      <VideoDisplay
        address={
          "https://cdn.retrac.site/public/01J7B2FNTZ4SGMKWGPCKSEXWF3/RetracSeason14Card.mp4"
        }
        backup={
          <img
            src={IMAGES[imageIndex]}
            className="absolute top-0 left-0 w-full h-full object-cover object-center z-50 pointer-events-none"
            draggable={false}
            style={{
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.05))",
            }}
          />
        }
      />

      <div
        className="absolute top-0 left-0 w-full h-full bg-center bg-cover overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(100% 60% at 0% 100%, #0f9bfb10 0%, #00000000 100%)",
        }}
      ></div>

      <div className="bg-fuchsia-900"></div>

      {buildLaunched && (
        <UI.Button
          colour="neutral"
          className="p-1.5 mt-auto backdrop-blur-2xl z-10"
          disabled
          style={{
            cursor: "not-allowed",
          }}
        >
          <span className="text-neutral-400">
            {/* Fortnite is Currently Running */}
            {isAnyDownloadActive
              ? "Download in Progress"
              : "Fortnite is Currently Running"}
          </span>
        </UI.Button>
      )}
    </div>
  );
};

type VideoDisplayProps = {
  address: string;
  backup: React.ReactNode;
};

const VideoDisplay = (props: VideoDisplayProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleLoadedData = () => {
    setVideoLoaded(true);
  };

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.addEventListener("loadeddata", handleLoadedData);

    return () => {
      if (!videoRef.current) return;
      videoRef.current.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [videoRef]);

  return (
    <>
      <video
        className="absolute top-0 left-0 w-full h-full object-cover object-center"
        style={{
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.10))",
        }}
        ref={videoRef}
        src={props.address}
        autoPlay
        loop
        muted
      />

      {!videoLoaded && props.backup}
    </>
  );
};

export default FortniteWidget;
