import { useEffect, useState } from "react";
import { useSocket } from "src/socket";
import { useFriends } from "src/wrapper/friends";
import { useUserManager } from "src/wrapper/user";
import { useOptions } from "src/wrapper/options";

import { IoPersonAddSharp, IoPersonSharp } from "react-icons/io5";

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

  if (!options.show_friends) return null;

  return (
    <div className="no-scroll flex flex-col p-2 gap-2 h-full w-[58px] bg-[#191919] border-l-[#2e2e2e] border-l-1 border-solid overflow-y-auto overflow-x-hidden">
      {Array.from(friends._set).map((friend) => (
        <Friend key={friend[1].accountId} friend={friend[1]} />
      ))}

      {friends._set.size === 0 && (
        <div className="flex items-center justify-center aspect-square w-full bg-neutral-800/30 rounded-sm border-[#292929] border-1 border-solid overflow-hidden min-h-[40px] min-w-[40px] cursor-pointer hover:bg-neutral-800/50">
          <IoPersonAddSharp className="text-[#4a4949] text-xl" />
        </div>
      )}
    </div>
  );
};

type FriendProps = {
  friend: FriendInformation;
};

const Friend = (props: FriendProps) => {
  const [imageRendered, setImageRendered] = useState(false);

  return (
    <div className="flex items-center justify-center aspect-square w-full bg-neutral-800/30 rounded-sm border-[#292929] border-1 border-solid overflow-hidden min-h-[40px] min-w-[40px]">
      <img
        src={props.friend.discordAvatarUrl}
        alt="Friend Avatar"
        className="w-full h-full object-cover object-center pointer-events-none"
        style={{ display: imageRendered ? "block" : "none" }}
        onLoad={() => setImageRendered(true)}
        onError={(e) => e.preventDefault()}
        draggable={false}
      />

      <IoPersonSharp className="text-[#2f2f2f] text-2xl" />
    </div>
  );
};

export default FriendsList;
