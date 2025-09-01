import { useRetrac } from "src/wrapper/retrac";

import UI from "src/components/core/default";

const NewsWidget = () => {
  const retrac = useRetrac();

  return (
    <div className="flex flex-col p-2 gap-0.5 w-full  @max-xl:w-full max-w-full @max-xl:max-w-full bg-neutral-800/10 rounded-sm border-neutral-700/40 border-1 border-solid overflow-hidden">
      <UI.H1 className="z-20">Updates & News</UI.H1>

      <p className="font-plex text-sm leading-[15px] text-neutral-400 mb-1.5 z-10">
        We are constantly updating Retrac with new features, bug fixes, and
        improvements.
      </p>

      <div className="flex flex-col gap-0.5 overflow-hidden">
        {retrac.launcher_news.slice(0, 8).map((item, i) => (
          <div
            className="overflow-hidden whitespace-nowrap overflow-ellipsis"
            key={i}
          >
            <NewsItem {...item} />
          </div>
        ))}

        <p className="mt-1 font-plex leading-[14px] min-w-max cursor-pointer hover:underline text-neutral-500 text-[12px]">
          View All...
        </p>
      </div>
    </div>
  );
};

const NewsItem = (props: LauncherNewsItem) => {
  const retrac = useRetrac();

  const isnew =
    new Date(props.date).getTime() > new Date().getTime() - 60 * 60 * 24 * 7;

  const date = new Date(props.date);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return (
    <p
      className="font-plex text-[14px] text-base leading-[16px] cursor-pointer hover:underline text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden"
      onClick={() => {
        retrac.set_selected_news_item(props);
        retrac.set_show_news(true);
      }}
    >
      {isnew && (
        <span className="text-blue-300 text-[12px] whitespace-nowrap overflow-visible overflow-x-hidden overflow-ellipsis">
          NEW!{" "}
        </span>
      )}
      {`${day}/${month}/${year}`} -{" "}
      <span className="text-neutral-300 whitespace-nowrap overflow-visible overflow-x-hidden max-w-2 overflow-ellipsis">
        {props.title}
      </span>
      <span className="text-neutral-500 text-[12px] font-semibold whitespace-nowrap overflow-visible overflow-x-hidden max-w-2 overflow-ellipsis uppercase">
        {" "}
        {props.updateType !== "" ? props.updateType + " " : ""}Update
      </span>
    </p>
  );
};

export default NewsWidget;
