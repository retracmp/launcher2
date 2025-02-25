import { IoCloseSharp, IoArrowBackSharp } from "react-icons/io5";

const Frame = () => {
  return (
    <main
      className="flex flex-row w-full h-full bg-neutral-900"
      data-tauri-drag-region
    >
      <nav className="flex h-full w-15 border-r-[#2e2e2e] border-r-1 border-solid"></nav>
      <div className="flex flex-1 flex-col">
        <nav
          className="flex items-center pl-1.5 w-full bg-[#191919] h-7 border-b-[#2e2e2e] border-b-1 border-solid"
          data-tauri-drag-region
        >
          <p
            className="text-neutral-300 font-plex text-[14px] leading-[14px] text-base"
            data-tauri-drag-region
          >
            Retrac
          </p>
          <s className="ml-auto" />
          <button className="flex items-center justify-center w-9 h-full cursor-pointer hover:bg-[#2e2e2e] hover:bg-opacity-50">
            <IoArrowBackSharp className="text-neutral-400 w-[14px] h-[14px]" />
          </button>
          <button className="flex items-center justify-center w-9 h-full cursor-pointer hover:bg-[#2e2e2e] hover:bg-opacity-50">
            <IoCloseSharp className="text-neutral-400" />
          </button>
        </nav>
      </div>
    </main>
  );
};

export default Frame;
