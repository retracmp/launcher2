import { useEffect, useRef, useState } from "react";
import { useSocket } from "src/socket";
import { useFriends } from "src/wrapper/friends";
import { useUserManager } from "src/wrapper/user";
import { useOptions } from "src/wrapper/options";

import { IoPersonAddSharp, IoPersonSharp } from "react-icons/io5";
import { motion } from "motion/react";
import { useHover } from "src/wrapper/hover";

const FriendsList = () => {
  const socket = useSocket();
  const options = useOptions();

  const friends = useFriends();
  const user = useUserManager();

  const onSocketRecieveFriendInfo = (
    data: SocketDownEventDataFromType<"friend_infos">
  ) => {
    friends.populateFriends(data.friendInformation);
  };
  useEffect(() => {
    if (socket._socket === null) return;
    if (user._user === null) return;

    socket.bind("friend_infos", onSocketRecieveFriendInfo);

    socket.send({
      id: "request_friend_info",
      friendIds: Object.values(user._user.Account.Friendships)
        .filter((f) => f.Status === "ACCEPTED")
        .map((f) => (f.Account === user._user?.ID ? f.Friend : f.Account))
        .filter((f) => !friends._set.has(f)),
    } as Omit<SocketUpEventDataFromType<"request_friend_info">, "version">);

    return () => {
      socket.unbind("friend_infos", onSocketRecieveFriendInfo);
    };
  }, [socket._socket, user._user]);

  return (
    <motion.div
      className="no-scroll flex flex-col p-2 gap-2 h-full w-[58px] bg-neutral-700/10 border-l-neutral-700/40 border-l-1 border-solid overflow-y-auto overflow-x-hidden"
      initial={{
        width: options.show_friends ? 58 : 0,
        paddingLeft: options.show_friends ? 8 : 0,
        paddingRight: options.show_friends ? 8 : 0,
        gap: options.show_friends ? 8 : 0,
        opacity: options.show_friends ? 1 : 0,
      }}
      animate={{
        width: options.show_friends ? 58 : 0,
        paddingLeft: options.show_friends ? 8 : 0,
        paddingRight: options.show_friends ? 8 : 0,
        gap: options.show_friends ? 8 : 0,
        opacity: options.show_friends ? 1 : 0,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      {Array.from(friends._set).map((friend) => (
        <Friend key={friend[1].accountId} friend={friend[1]} />
      ))}

      {friends._set.size === 0 && (
        <div className="flex items-center justify-center aspect-square w-full bg-neutral-800/30 rounded-sm border-neutral-700/20 border-1 border-solid overflow-hidden min-h-[40px] min-w-[40px] cursor-pointer hover:bg-neutral-800/50">
          <IoPersonAddSharp className="text-neutral-700 text-xl" />
        </div>
      )}
    </motion.div>
  );
};

type FriendProps = {
  friend: FriendInformation;
};

const Friend = (props: FriendProps) => {
  const [imageRendered, setImageRendered] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);
  const hover = useHover();

  const HoverComponent = () => {
    return (
      <div className="flex flex-row items-center p-1 px-2 rounded-[0.35rem] bg-[#181818] border-neutral-700/40 border-[1px] border-solid overflow-hidden">
        <span className="text-sm leading-[15px] min-w-fit mb-[1px] text-neutral-300/90">
          {props.friend.displayName}
        </span>
      </div>
    );
  };

  const onHoverEntered = () => {
    hover.set(
      parentRef.current,
      <HoverComponent />,
      props.friend.accountId,
      "LEFT"
    );
  };
  const onHoverExited = () => {
    hover.close(props.friend.accountId);
  };

  return (
    <div
      ref={parentRef}
      onMouseEnter={onHoverEntered}
      onMouseLeave={onHoverExited}
      className="flex items-center justify-center aspect-square w-full bg-neutral-800/30 rounded-sm border-neutral-700/20 border-1 border-solid overflow-hidden min-h-[40px] min-w-[40px]"
    >
      <img
        src={props.friend.discordAvatarUrl}
        alt="Friend Avatar"
        className="w-full h-full object-cover object-center pointer-events-none"
        style={{ display: imageRendered ? "block" : "none" }}
        onLoad={() => setImageRendered(true)}
        onError={(e) => e.preventDefault()}
        draggable={false}
      />

      <IoPersonSharp className="text-neutral-700 text-2xl" />
    </div>
  );
};

export default FriendsList;
