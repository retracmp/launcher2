import UI from "src/components/core/default";

const NewsWidget = () => {
  return (
    <div className="flex flex-col p-2 gap-1 w-[60%] max-w-[60%] bg-neutral-800/10 rounded-xs border-[#2e2e2e] border-1 border-solid overflow-hidden">
      <UI.P>
        <span className="font-[500] font-geist">Updates & News</span>
      </UI.P>

      <div className="flex flex-col gap-[2px] ">
        <p className="font-plex text-[14px] text-base leading-[14px] cursor-pointer hover:underline text-neutral-400 whitespace-nowrap overflow-hidden overflow-ellipsis">
          <span className="text-blue-300 text-[12px] whitespace-nowrap overflow-hidden overflow-ellipsis">
            NEW!{" "}
          </span>
          Update 21/03/2024 -{" "}
          <span className="text-neutral-300 whitespace-nowrap overflow-hidden max-w-2 overflow-ellipsis">
            Quick Updates to Lategame & Arena.
          </span>
        </p>

        <p className="font-plex text-[14px] text-base leading-[14px] cursor-pointer hover:underline text-neutral-400 whitespace-nowrap overflow-hidden overflow-ellipsis">
          Cosmetic Update 17/03/2024 -{" "}
          <span className="text-neutral-300">New Cosmetics & Bundles.</span>
        </p>

        <p className="font-plex text-[14px] text-base leading-[14px] cursor-pointer hover:underline text-neutral-400 whitespace-nowrap overflow-hidden overflow-ellipsis">
          Economy Reset 02/03/2024 -{" "}
          <span className="text-neutral-300">
            V-Bucks reward price changes.
          </span>
        </p>
        <p className="font-plex text-[14px] text-base leading-[14px] cursor-pointer hover:underline text-neutral-400 whitespace-nowrap overflow-hidden overflow-ellipsis">
          Server Update 27/02/2024 -{" "}
          <span className="text-neutral-300">
            EU French servers now available.
          </span>
        </p>

        <p className="font-plex leading-[14px] min-w-max cursor-pointer hover:underline text-neutral-500 text-[12px]">
          View All...
        </p>
      </div>
    </div>
  );
};

export default NewsWidget;
