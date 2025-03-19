import { useEffect } from "react";
import { useSocket } from "src/socket";
import { useFriends } from "src/wrapper/friends";
import { useUserManager } from "src/wrapper/user";

const FriendsList = () => {
  const socket = useSocket();

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
    <div className="flex flex-col p-2 gap-2 h-full w-[58px] bg-[#191919] border-l-[#2e2e2e] border-l-1 border-solid">
      {friends._friendInformation.map((friend) => (
        <Friend key={friend.accountId} friend={friend} />
      ))}
    </div>
  );
};

type FriendProps = {
  friend: FriendInformation;
};

const Friend = (props: FriendProps) => {
  return (
    <div className="flex aspect-square w-full bg-neutral-800/30 rounded-xs border-[#292929] border-1 border-solid overflow-hidden">
      <img
        src={props.friend.discordAvatarUrl}
        alt="Friend Avatar"
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
};

export default FriendsList;
