import UI from "src/components/core/default";

const FortniteWidget = () => {
  return (
    <div className="flex flex-col p-2 gap-0.5 w-[50%] min-w-80 bg-neutral-800/10 rounded-xs border-[#2e2e2e] border-1 border-solid">
      <UI.P className="text-neutral-400">
        <span className="font-[600] font-geist text-neutral-300">
          {" "}
          Chapter 2 Season 4
        </span>{" "}
      </UI.P>

      <UI.P className="text-neutral-400 max-w-0 mb-2">
        Also known as
        <span className="text-neutral-300"> Stark Season </span> was the
        fourteenth season which started on August 27th 2020, and ended on
        December 1st 2020.
      </UI.P>

      {/* <UI.Button colour="blue" className="p-1.5 mt-auto">
        <UI.P className="text-neutral-300">
          <span className="font-[500]">Download</span>
        </UI.P>
      </UI.Button> */}

      {/* <UI.Button colour="green" className="p-1.5 mt-auto">
        <UI.P className="text-neutral-300">
          <span className="font-[500]">Launch</span>
        </UI.P>
      </UI.Button> */}

      <UI.Button
        colour="neutral"
        className="p-1.5 mt-auto bg-neutral-800"
        disabled
        style={{
          cursor: "not-allowed",
        }}
      >
        <UI.P className="text-neutral-400">
          <span className="font-[500]">Fortnite is already running.</span>
        </UI.P>
      </UI.Button>
    </div>
  );
};

export default FortniteWidget;
