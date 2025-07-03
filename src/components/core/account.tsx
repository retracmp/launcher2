import { useState } from "react";
import { useUserManager } from "src/wrapper/user";

import UI from "./default";
import { IoPersonSharp } from "react-icons/io5";
import { HiPencilAlt } from "react-icons/hi";

type AccountProps = {
  username_editable?: boolean;
};

const Account = (props: AccountProps) => {
  const [imageRendered, setImageRendered] = useState(false);

  const user = useUserManager();
  if (!user._user) return null;

  return (
    <div className="group relative flex flex-row w-full p-2 rounded-sm border-neutral-700/40 border-[1px] border-solid gap-2">
      <div className="flex items-center justify-center w-12 min-w-12 h-12 border-neutral-700/40 border-[1px] border-solid rounded-sm overflow-hidden">
        <img
          src={
            `https://cdn.discordapp.com/avatars/${user._user.Account.Discord.ID}/${user._user.Account.Discord.Avatar}.png?size=512` ||
            ""
          }
          style={{ display: imageRendered ? "block" : "none" }}
          onLoad={() => setImageRendered(true)}
          onError={(e) => e.preventDefault()}
          draggable={false}
          className="w-full h-full min-w-max aspect-square object-center"
        />

        <IoPersonSharp className="text-neutral-700 text-2xl" />
      </div>
      <div className="flex flex-col w-full h-full justify-center">
        <span className="font-[600] text-neutral-300 leading-4 flex flex-row items-center gap-1">
          {user._user.Account.DisplayName}{" "}
          <span className="font-[500] text-xs text-neutral-500 h-3.5">
            {user._user.Account.Discord.ID}
          </span>
        </span>
        <span className="font-[500] text-sm text-neutral-400 leading-4">
          {user._user.ID}
        </span>
      </div>

      {props.username_editable && (
        <div className="flex flex-row items-center gap-2 ml-auto px-1">
          <UI.RowButton
            tooltip="Edit Username"
            colour="green"
            on_click={() => {}}
            _last
          >
            <HiPencilAlt className="w-full h-full" />
          </UI.RowButton>
        </div>
      )}
    </div>
  );
};

export default Account;
