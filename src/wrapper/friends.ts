import { create } from "zustand";

type FriendsState = {
  _friendInformation: FriendInformation[];
  populateFriends: (friends: FriendInformation[]) => void;
  removeFriends: (friends: FriendInformation[]) => void;
};

export const useFriends = create<FriendsState>((set, get) => ({
  _friendInformation: [],

  populateFriends: (friends) =>
    set({ _friendInformation: [...get()._friendInformation, ...friends] }),
  removeFriends: (friends) =>
    set({
      _friendInformation: get()._friendInformation.filter(
        (friend) => !friends.includes(friend)
      ),
    }),
}));
