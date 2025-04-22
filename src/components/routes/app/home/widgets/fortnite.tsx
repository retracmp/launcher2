import UI from "src/components/core/default";

const IMAGES = [
  "https://d1lss44hh2trtw.cloudfront.net/assets/article/2020/08/27/fortnite-chapter-2-season-4-marvel_feature.jpg",
  "https://fortniteinsider.com/wp-content/uploads/2020/08/Fortnite-Chapter-2-Season-4-Battle-Pass-Skins.jpg",
];

const FortniteWidget = () => {
  const imageIndex = new Date().getMinutes() % IMAGES.length;

  return (
    <div className="relative flex flex-col p-2 gap-0.5 min-w-[45%] w-[70%] @max-xl:w-[100%] aspect-[5/2] bg-neutral-800/10 rounded-sm border-[#2e2e2e] border-1 border-solid overflow-hidden">
      <UI.H1 className="z-20">Chapter 2 Season 4</UI.H1>

      <UI.P className="text-neutral-400 max-w-0 mb-2 z-10">
        Also known as
        <span className="text-neutral-300"> Stark Season </span> was the
        fourteenth season which started on August 27th 2020, and ended on
        December 1st 2020.
      </UI.P>

      {/* <UI.Button
        colour="blue"
        className="p-1.5 py-1 mt-auto z-10 backdrop-blur-2xl"
      >
        <span className="text-neutral-300">Download Now</span>
      </UI.Button> */}

      <UI.Button
        colour="green"
        className="p-1.5 mt-auto z-10 backdrop-blur-2xl"
      >
        <span className="text-neutral-300">Launch Process</span>
      </UI.Button>

      <img
        src={IMAGES[imageIndex]}
        className="absolute top-0 left-0 w-full h-full object-cover object-center"
        draggable={false}
        style={{
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.05))",
        }}
      />

      <div
        className="absolute top-0 left-0 w-full h-full bg-center bg-cover overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(100% 60% at 0% 100%, #0f9bfb10 0%, #00000000 100%)",
        }}
      ></div>

      {/* <UI.Button
        colour="neutral"
        className="p-1.5 mt-auto bg-neutral-800 backdrop-blur-2xl z-10 hover:bg-neutral-800/50"
        disabled
        style={{
          cursor: "not-allowed",
        }}
      >
        <span className="text-neutral-400">Process already running.</span>
      </UI.Button> */}
    </div>
  );
};

export default FortniteWidget;
