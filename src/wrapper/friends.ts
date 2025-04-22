import { create } from "zustand";

type FriendsState = {
  _set: Map<string, FriendInformation>;

  populateFriends: (friends: FriendInformation[]) => void;
  removeFriends: (friends: FriendInformation[]) => void;
};

export const useFriends = create<FriendsState>((set, get) => ({
  _set: new Map(),

  populateFriends: (friends) => {
    const _set = get()._set;

    friends?.forEach((friend) => {
      _set.set(friend.accountId, friend);
    });

    set({ _set });
  },
  removeFriends: (friends) => {
    const _set = get()._set;

    friends.forEach((friend) => {
      _set.delete(friend.accountId);
    });

    set({
      _set,
    });
  },
}));
