import { create } from "zustand";

type FriendsState = {
  _friendInformation: FriendInformation[];
  _set: Set<string>;

  populateFriends: (friends: FriendInformation[]) => void;
  removeFriends: (friends: FriendInformation[]) => void;
};

export const useFriends = create<FriendsState>((set, get) => ({
  _friendInformation: [],
  _set: new Set(),

  populateFriends: (friends) => {
    const _set = get()._set;
    friends.forEach((friend) => {
      if (_set.has(friend.accountId)) return;
      _set.add(friend.accountId);
    });

    set({
      _friendInformation: [...get()._friendInformation, ...friends],
      _set,
    });
  },
  removeFriends: (friends) => {
    const _set = get()._set;
    const _friendInformation = get()._friendInformation.filter((f) => {
      if (friends.some((friend) => friend.accountId === f.accountId)) {
        _set.delete(f.accountId);
        return false;
      }
      return true;
    });

    set({ _friendInformation, _set });
  },
}));
