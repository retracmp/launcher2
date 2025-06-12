import { useEffect } from "react";
import { useRetrac } from "src/wrapper/retrac";
import { useApplicationInformation } from "src/wrapper/tauri";
import { useUserManager } from "src/wrapper/user";
import { useOptions } from "src/wrapper/options";
import { useBannerManager } from "src/wrapper/banner";

import {
  BooleanOption,
  FileOption,
  NumberOption,
  OptionGroup,
  ColourOption,
} from "src/components/routes/app/settings/option";
import { IoLogOutSharp } from "react-icons/io5";
import UI from "src/components/core/default";
import Account from "src/components/core/account";

const SettingsPage = () => {
  const application = useApplicationInformation();
  const user = useUserManager();
  const options = useOptions();
  const retrac = useRetrac();

  const bannerManager = useBannerManager();

  useEffect(() => {
    if (user.has_any_donation_tier()) return;
    if (retrac.donation_message_popped) return;

    bannerManager.push({
      closable: true,
      colour: "pink",
      id: "settings-donation",
      text: `Looking for themes & customisation options? Consider supporting Retrac with a donation!`,
    });

    retrac.set_donation_message_popped(true);
  }, [user._user, retrac.donation_message_popped]);

  return (
    <>
      <InvisibleItem className="text-blue-300" />
      <InvisibleItem className="text-orange-300" />
      <InvisibleItem className="text-purple-300" />
      <InvisibleItem className="text-red-300" />
      <InvisibleItem className="text-pink-300" />
      <InvisibleItem className="text-teal-300" />
      <InvisibleItem className="text-green-300" />
      <InvisibleItem className="text-slate-300" />
      <InvisibleItem className="text-gray-300" />
      <InvisibleItem className="text-indigo-300" />
      <InvisibleItem className="text-neutral-300" />
      <InvisibleItem className="text-emerald-300" />
      <InvisibleItem className="text-lime-300" />
      <InvisibleItem className="text-rose-300" />
      <InvisibleItem className="text-violet-300" />
      <InvisibleItem className="bg-green-800/50" />

      <OptionGroup _first>
        <div className="flex flex-col gap-[0.2rem]">
          <UI.H1 className="font-[300] text-neutral-300">
            Settings & Options
          </UI.H1>
          <UI.P className="text-neutral-400">
            Customize your Retrac experience here.
          </UI.P>
        </div>
      </OptionGroup>

      <OptionGroup title="Network" _animate>
        <BooleanOption
          title="Auto Download"
          description={
            <>
              Any new content patches will be downloaded and installed{" "}
              <b>automatically</b>.
            </>
          }
          state={options.auto_download}
          set={options.set_auto_download}
          icon="IoCodeDownloadSharp"
          colour="blue"
          _animate
        />

        <BooleanOption
          title="Detailed Downloads"
          description={<>Show extra information when downloading content.</>}
          state={options.advanced_download_view}
          set={options.set_show_advanced_download_view}
          _animate
        />

        {/* <BooleanOption
          title="Limit Download Speed"
          description={
            <>Limit the download speed to a certain amount of bandwidth.</>
          }
          state={options.limit_download_speed}
          set={options.set_limit_download_speed}
        />

        {options.limit_download_speed && (
          <NumberOption
            title="Download Limit"
            description={
              <>
                The maximum amount of bandwidth that can be used for downloads.
              </>
            }
            state={options.megabyte_download_limit}
            set={options.set_megabyte_download_limit}
            _number_extra_text="MB/s"
            _number_min={0}
            _number_max={5120}
          />
        )} */}

        <FileOption
          title="Content Directory"
          description={
            <>
              The path that all builds will be <b>downloaded</b> into.
            </>
          }
          state={options.content_directory}
          set={options.set_content_directory}
          icon="IoFolderOpenSharp"
          colour="orange"
          _animate
        />
      </OptionGroup>

      <OptionGroup title="Gameplay Tweaks" _animate>
        <BooleanOption
          title="Simple Edit"
          description={
            <>Edit at lightning speed, exactly like latest Fortnite.</>
          }
          state={options.simple_edit}
          set={options.set_simple_edit}
          _animate
        />

        <BooleanOption
          title="Disable Pre-Edits"
          description={<>Prevent accidental pre-edits when building.</>}
          state={options.disable_pre_edits}
          set={options.set_disable_pre_edits}
          _animate
        />

        <BooleanOption
          title="Reset on Release"
          description={
            <>Reset builds on the release of a key, improves editing speed.</>
          }
          state={options.reset_on_release}
          set={options.set_reset_on_release}
          _animate
        />
      </OptionGroup>

      <OptionGroup title="Client Preferences" _animate>
        {user.has_any_donation_tier() && (
          <>
            <ColourOption
              title="Theme"
              description={
                <>Show off style with colourful redesigns of the launcher!</>
              }
              state={options.custom_theme_colour}
              set={options.set_custom_theme_colour}
              icon="IoColorPaletteSharp"
              colour="purple"
              _colour_options={[
                "#4f4f4f",
                "#8ec5ff80",
                "#ffb86a90",
                "#fda5d590",
                "#1f1f1f",
                "#bbf45140",
              ]}
              _animate
            />

            <BooleanOption
              title="Show Background Image"
              description={
                <>Customise your look with a frosted glass background image.</>
              }
              state={options.enable_background_image}
              set={options.set_enable_background_image}
              icon="IoImage"
              colour="blue"
              _animate
              _attachImage
              _attachedImagePath={options.background_image}
              _setAttachedImagePath={options.set_background_image}
            />
          </>
        )}

        <BooleanOption
          title="Wide Sidebar"
          description={<>Makes the navigation drawer wider, showing labels.</>}
          state={options.wide_drawer}
          set={options.set_wide_drawer}
          _animate
        />

        <BooleanOption
          title="Friends List"
          description={
            <>Show your friends and their activity on the right sidebar.</>
          }
          state={options.show_friends}
          set={options.set_show_friends}
          _animate
        />

        {user.has_any_donation_tier() && (
          <>
            <NumberOption
              title="Leaderboard Page Size"
              description={
                <>
                  Changes how many players are shown on the leaderboard per
                  page.
                </>
              }
              state={options.leaderboard_page_size}
              set={(num) => {
                options.set_leaderboard_page_size(
                  Math.max(1, Math.min(num, 100))
                );
              }}
              _number_max={100}
              _number_min={1}
              _animate
            />
          </>
        )}

        <BooleanOption
          title="Grid Layout for Builds"
          description={<>Display your installed versions in a grid layout.</>}
          state={options._tiled_builds}
          set={options.set_tiled_builds}
        />
      </OptionGroup>

      <OptionGroup title="Your Account" _last>
        <Account />
      </OptionGroup>

      <div className="flex flex-col gap-1.5 p-2">
        <div className="relative flex flex-col w-[100%] overflow-hidden">
          <span className="text-xs font-[400] text-neutral-500">
            {application.name} {application.version} on Windows{" "}
            {application.windowsVersion}
          </span>
          <span className="text-xs font-[400] text-neutral-500 select-text">
            {user._user?.ID}
          </span>
        </div>

        <UI.Button
          colour="invisible"
          className="py-0 px-2 mt-auto z-10 w-min gap-0"
          onClick={() => user.logout()}
        >
          <IoLogOutSharp className="text-neutral-400 w-4 h-4" />
          <span className="text-neutral-400">Logout</span>
        </UI.Button>
      </div>
    </>
  );
};

const InvisibleItem = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={`${props.className} min-w-0 max-w-0 min-h-0 max-h-0 hidden`}
    />
  );
};

export default SettingsPage;
