import { useRef, useState } from "react";
import { useUserManager } from "src/wrapper/user";
import { useLauncherSocket } from "src/sockets";

import UI from "./default";
import { IoCloseSharp, IoPersonSharp } from "react-icons/io5";
import { HiCheck, HiPencilAlt } from "react-icons/hi";

type AccountProps = {
  username_editable?: boolean;
};

const Account = (props: AccountProps) => {
  const user = useUserManager();
  const socket = useLauncherSocket();

  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(
    user._user?.Account.DisplayName || ""
  );
  const usernameEditComponentRef = useRef<HTMLInputElement>(null);
  const [imageRendered, setImageRendered] = useState(false);
  return null;
  if (!user._user) return null;

  const handleUsernameChange = async () => {
    socket.send({
      id: "change_display_name",
      newDisplayName: newUsername,
    } as Omit<SocketUpEventDataFromType<"change_display_name">, "version">);
  };

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
          <>
            <input
              ref={usernameEditComponentRef}
              type="text"
              defaultValue={user._user.Account.DisplayName}
              className="bg-neutral-800 rounded-sm px-[0.2rem] py-0.5 focus:outline-none transition-colors duration-200"
              style={
                editingUsername
                  ? {}
                  : {
                      display: "none",
                    }
              }
              onChange={(e) => {
                setNewUsername(e.target.value);
              }}
              value={newUsername}
              spellCheck={false}
            />
          </>
          {!editingUsername && user._user.Account.DisplayName}{" "}
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
          {!editingUsername && (
            <UI.RowButton
              tooltip="Edit Username"
              colour="green"
              on_click={() => {
                setEditingUsername(!editingUsername);
                setNewUsername(user._user?.Account.DisplayName || "");

                setTimeout(() => {
                  if (usernameEditComponentRef.current) {
                    usernameEditComponentRef.current.focus();
                    usernameEditComponentRef.current.select();
                  }
                }, 20);
              }}
              _last
            >
              <HiPencilAlt className="w-full h-full" />
            </UI.RowButton>
          )}
          {editingUsername && (
            <>
              <UI.RowButton
                tooltip="Cancel"
                colour="red"
                on_click={() => {
                  setEditingUsername(false);
                  setNewUsername(user._user?.Account.DisplayName || "");
                }}
              >
                <IoCloseSharp className="w-full h-full" />
              </UI.RowButton>
              <UI.RowButton
                tooltip="Save Username"
                colour="green"
                on_click={() => {
                  setEditingUsername(false);
                  handleUsernameChange();
                }}
                _last
              >
                <HiCheck className="w-full h-full" />
              </UI.RowButton>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Account;
