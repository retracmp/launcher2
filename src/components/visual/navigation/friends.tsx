import { useEffect, useState } from "react";
import { useLauncherSocket } from "src/sockets";
import { useFriends } from "src/wrapper/friends";
import { useUserManager } from "src/wrapper/user";
import { useOptions } from "src/wrapper/options";

import { IoPerson, IoPersonAddSharp } from "react-icons/io5";
import { motion } from "motion/react";
import { twJoin } from "tailwind-merge";
import { formatTime } from "src/helpers/time";

const FriendsList = () => {
  const [extend, set_extend] = useState(false);

  const socket = useLauncherSocket();
  const options = useOptions();

  const friends = useFriends();
  const user = useUserManager();

  const onSocketRecieveFriendInfo = (
    data: SocketDownEventDataFromType<"friend_infos">
  ) => {
    friends.populateFriends(data.friendInformation);
  };

  const onSocketRecieveFriendInfoUpdate = (
    data: SocketDownEventDataFromType<"friend_info_update">
  ) => {
    friends.populateFriends([data.friendInformation]);
  };

  useEffect(() => {
    if (socket.socket === null) return;
    if (user._user === null) return;

    socket.bind("friend_infos", onSocketRecieveFriendInfo);
    socket.bind("friend_info_update", onSocketRecieveFriendInfoUpdate);

    socket.send({
      id: "request_friend_info",
    } as Omit<SocketUpEventDataFromType<"request_friend_info">, "version">);

    return () => {
      socket.unbind("friend_infos", onSocketRecieveFriendInfo);
      socket.unbind("friend_info_update", onSocketRecieveFriendInfoUpdate);
    };
  }, [socket.socket, user._user]);

  if (user._user === null) return;

  return (
    <motion.div
      className="no-scroll flex flex-col p-2 gap-2 h-full w-[58px] bg-neutral-700/10 border-l-neutral-700/40 border-l-1 border-solid overflow-y-auto overflow-x-hidden"
      initial={{
        width: options.show_friends ? (extend ? 188 : 58) : 0,
        paddingLeft: options.show_friends ? 8 : 0,
        paddingRight: options.show_friends ? 8 : 0,
        opacity: options.show_friends ? 1 : 0,
      }}
      animate={{
        width: options.show_friends ? (extend ? 188 : 58) : 0,
        paddingLeft: options.show_friends ? 8 : 0,
        paddingRight: options.show_friends ? 8 : 0,
        opacity: options.show_friends ? 1 : 0,
      }}
      onMouseEnter={() => set_extend(true)}
      onMouseLeave={() => set_extend(false)}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      {Array.from(friends._set)
        .sort((a, b) => {
          if (a[1].fortniteOpen && !b[1].fortniteOpen) return -3;
          if (!a[1].fortniteOpen && b[1].fortniteOpen) return 3;
          if (a[1].launcherOpen && !b[1].launcherOpen) return -2;
          if (!a[1].launcherOpen && b[1].launcherOpen) return 2;
          return 0;
        })
        .map((friend) => (
          <Friend
            key={friend[1].accountId}
            friend={friend[1]}
            show_border={extend}
          />
        ))}

      {friends._set.size === 0 && (
        <div className="flex items-center justify-center aspect-square w-full max-h-[41px] bg-neutral-800/30 rounded-md border-neutral-700/20 border-1 border-solid overflow-hidden min-h-[40px] min-w-[40px] cursor-pointer hover:bg-neutral-800/50">
          <IoPersonAddSharp className="text-neutral-700 text-lg mr-0.5" />
        </div>
      )}
    </motion.div>
  );
};

type FriendProps = {
  friend: FriendInformation;
  show_border: boolean;
};

const Friend = (props: FriendProps) => {
  const [discordImageRendered, setDiscordRendered] = useState(false);
  const [characterImageRendered, setImageRendered] = useState(false);

  return (
    <div className="flex flex-row gap-2 w-full max-h-[41px] cursor-pointer hover:bg-neutral-800/50 rounded-md border-neutral-700/20 border-1 border-solid">
      <div
        className={twJoin(
          "relative flex items-center justify-center aspect-square bg-neutral-800/30 rounded-md min-h-[40px] overflow-visible",
          props.show_border &&
            "border-neutral-700/20 border-r-1 border-solid rounded-r-none"
        )}
      >
        <div
          className={twJoin(
            "absolute z-20 w-3 h-3 rounded-full top-[calc(100%-0.5rem)] left-[calc(100%-0.5rem)] border-2 border-solid border-neutral-900",
            props.friend.fortniteOpen
              ? "bg-green-400"
              : props.friend.launcherOpen
              ? "bg-yellow-400"
              : "bg-neutral-600"
          )}
        />
        {!!!props.friend.discordAvatarUrl && (
          <img
            src={props.friend.discordAvatarUrl}
            alt="Friend Avatar"
            className="w-full h-full object-cover object-center pointer-events-none rounded-md rounded-r-none min-w-[41px] min-h-[41px]"
            style={{ display: discordImageRendered ? "block" : "none" }}
            onLoad={() => setDiscordRendered(true)}
            onError={(e) => e.preventDefault()}
            draggable={false}
          />
        )}
        <img
          src={`https://fortnite-api.com/images/cosmetics/br/${props.friend.currentCharacter}/icon.png`}
          alt="Friend Avatar"
          className="w-full h-full object-cover object-center pointer-events-none rounded-md rounded-r-none min-w-[41px] min-h-[41px]"
          style={{ display: characterImageRendered ? "block" : "none" }}
          onLoad={() => setImageRendered(true)}
          onError={(e) => e.preventDefault()}
          draggable={false}
        />

        {!characterImageRendered && (
          <IoPerson className="text-neutral-700 text-lg" />
        )}
      </div>

      <div className="flex flex-col flex-1 gap-1 justify-center overflow-hidden whitespace-nowrap">
        <p className="text-neutral-300 text-sm leading-3 overflow-ellipsis whitespace-nowrap">
          {props.friend.displayName}
        </p>
        <p
          className={twJoin(
            "text-xs leading-3",
            props.friend.fortniteOpen
              ? "text-green-300"
              : props.friend.launcherOpen
              ? "text-orange-300"
              : "text-neutral-400"
          )}
        >
          {props.friend.fortniteOpen ? (
            "Online"
          ) : props.friend.launcherOpen ? (
            "In the Launcher"
          ) : (
            <LastOnline time={props.friend.lastOnline} />
          )}
        </p>
      </div>
    </div>
  );
};

type LastOnlineProps = {
  time: string;
};

const LastOnline = (props: LastOnlineProps) => {
  const date = new Date(props.time);
  if (isNaN(date.getTime())) return <>Offline</>;
  if (formatTime(Date.now() - date.getTime()) === "0s")
    return <>Recently online</>;
  return <>Last online {formatTime(Date.now() - date.getTime())} ago</>;
};

export default FriendsList;
