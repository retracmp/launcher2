import UI from "src/components/core/default";

const FortniteWidget = () => {
  return (
    <div className="relative flex flex-col p-2 gap-0.5 min-w-[45%] w-[52%] max-w-120 @max-xl:w-full @max-xl:max-w-full aspect-[5/2] bg-neutral-800/10 rounded-xs border-[#2e2e2e] border-1 border-solid">
      <UI.P className="text-neutral-400 z-10">
        <span className="font-[600] font-geist text-neutral-300">
          {" "}
          Chapter 2 Season 4
        </span>{" "}
      </UI.P>

      <UI.P className="text-neutral-400 max-w-0 mb-2 z-10">
        Also known as
        <span className="text-neutral-300"> Stark Season </span> was the
        fourteenth season which started on August 27th 2020, and ended on
        December 1st 2020.
      </UI.P>

      <UI.Button colour="blue" className="p-1.5 mt-auto z-10 backdrop-blur-2xl">
        <UI.P className="text-neutral-300">
          <span className="font-[500]">Download</span>
        </UI.P>
      </UI.Button>

      {/* <UI.Button colour="green" className="p-1.5 mt-auto z-10 backdrop-blur-2xl">
        <UI.P className="text-neutral-300">
          <span className="font-[500]">Launch</span>
        </UI.P>
      </UI.Button> */}

      <img
        src="https://d1lss44hh2trtw.cloudfront.net/assets/article/2020/08/27/fortnite-chapter-2-season-4-marvel_feature.jpg"
        className="absolute top-0 left-0 w-full h-full object-cover object-center"
        draggable={false}
        style={{
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0))",
        }}
      />

      {/* <UI.Button
        colour="neutral"
        className="p-1.5 mt-auto bg-neutral-800 backdrop-blur-2xl z-10"
        disabled
        style={{
          cursor: "not-allowed",
        }}
      >
        <UI.P className="text-neutral-400">
          <span className="font-[500]">Fortnite is already running.</span>
        </UI.P>
      </UI.Button> */}
    </div>
  );
};

export default FortniteWidget;
