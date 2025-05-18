import { useRetrac } from "src/wrapper/retrac";

import UI from "src/components/core/default";

const NewsWidget = () => {
  const retrac = useRetrac();

  return (
    <div className="flex flex-col p-2 gap-1 w-full  @max-xl:w-full max-w-full @max-xl:max-w-full bg-neutral-800/10 rounded-sm border-[#2e2e2e] border-1 border-solid overflow-hidden">
      <UI.P>
        <span className="font-[500] font-geist">Updates & News</span>
      </UI.P>

      <div className="flex flex-col gap-[2px] overflow-hidden">
        {retrac.launcher_news.slice(0, 4).map((item, i) => (
          <div
            className="overflow-hidden whitespace-nowrap overflow-ellipsis"
            key={i}
          >
            <NewsItem {...item} />
          </div>
        ))}

        <p className="mt-auto font-plex leading-[14px] min-w-max cursor-pointer hover:underline text-neutral-500 text-[12px]">
          View All...
        </p>
      </div>
    </div>
  );
};

const NewsItem = (props: LauncherNewsItem) => {
  const isnew =
    new Date(props.date).getTime() > new Date().getTime() - 60 * 60 * 24 * 7;

  const date = new Date(props.date);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return (
    <p className="font-plex text-[14px] text-base leading-[16px] cursor-pointer hover:underline text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden">
      {isnew && (
        <span className="text-blue-300 text-[12px] whitespace-nowrap overflow-visible overflow-x-hidden overflow-ellipsis">
          NEW!{" "}
        </span>
      )}
      {props.updateType !== "" ? props.updateType + " " : ""}Update{" "}
      {`${day}/${month}/${year}`} -{" "}
      <span className="text-neutral-300 whitespace-nowrap overflow-visible overflow-x-hidden max-w-2 overflow-ellipsis">
        {props.title}
      </span>
    </p>
  );
};

export default NewsWidget;
