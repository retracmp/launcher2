type SocketBasicUpEvent = {
  version: string;
  id: string;
};

type SocketUpEvent_Heartbeat = SocketBasicUpEvent & {
  id: "heartbeat";
};

type SocketUpEvent_RequestUser = SocketBasicUpEvent & {
  id: "request_user";
};

type SocketUpEvent_RequestCode = SocketBasicUpEvent & {
  id: "request_code";
};

type SocketUpEvent_RequestLeaderboard = SocketBasicUpEvent & {
  id: "request_leaderboard";
  pagination: {
    page: number;
    pageSize: number;
    sortBy: "eliminations" | "points" | "hype";
  };
};

type SocketUpEvent_RequestFriendInfo = SocketBasicUpEvent & {
  id: "request_friend_info";
  friendIds: string[];
};

type SocketUpEvent_RequestServers = SocketBasicUpEvent & {
  id: "request_servers";
};

type SocketUpEvent_SubscribeOTP = SocketBasicUpEvent & {
  id: "otp_subscribe";
};

type SocketUpEvent_UnsubscribeOTP = SocketBasicUpEvent & {
  id: "otp_unsubscribe";
};

type SocketUpEvent_UnsubscribeOTP = SocketBasicUpEvent & {
  id: "otp_unsubscribe";
};

type SocketUpEvent_ChangeDisplayName = SocketBasicUpEvent & {
  id: "change_display_name";
  newDisplayName: string;
};

type SocketUpEvent =
  | SocketUpEvent_Heartbeat
  | SocketUpEvent_RequestUser
  | SocketUpEvent_RequestCode
  | SocketUpEvent_RequestLeaderboard
  | SocketUpEvent_RequestFriendInfo
  | SocketUpEvent_RequestServers
  | SocketUpEvent_SubscribeOTP
  | SocketUpEvent_UnsubscribeOTP
  | SocketUpEvent_ChangeDisplayName;

type SocketUpEventType = SocketUpEvent["id"];
type SocketUpEventDataFromType<T extends SocketUpEventType> = Prettify<
  Extract<SocketUpEvent, { id: T }>
>;

//

type heartbeat_test = SocketUpEventDataFromType<"heartbeat">;
type user_test = SocketUpEventDataFromType<"request_user">;
type code_test = SocketUpEventDataFromType<"request_code">;
type leaderboard_test = SocketUpEventDataFromType<"request_leaderboard">;
type friend_info_test = SocketUpEventDataFromType<"request_friend_info">;
type servers_test = SocketUpEventDataFromType<"request_servers">;
type otp_subscribe_test = SocketUpEventDataFromType<"otp_subscribe">;
type otp_unsubscribe_test = SocketUpEventDataFromType<"otp_unsubscribe">;
type change_displayname_test = SocketUpEventDataFromType<"change_displayname">;
