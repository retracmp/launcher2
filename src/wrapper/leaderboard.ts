import { create } from "zustand";

type LeaderboardState = {
  _cached_stats: Map<string, AggregatedStats>;

  _set: Map<string, LeaderboardEntry[][]>;
  _setMe: Map<string, LeaderboardRankInformation>;

  current_time_frame: TimeFrame;
  set_time_frame: (sortedBy: TimeFrame) => void;

  current_sort_key: StatKey;
  set_sort_key: (sortedBy: StatKey) => void;

  _pageInfo: LeaderboardPageInfo;
  setPageInfo: (pageInfo: LeaderboardPageInfo) => void;

  _page: number;
  nextPage: () => void;
  prevPage: () => void;
  resetPage: () => void;
  set_page: (page: number) => void;

  populateLeaderboard: (
    type: string,
    leaderboard: LeaderboardEntry[],
    page: number
  ) => void;
  populateMe: (type: string, entry: LeaderboardRankInformation) => void;
  get_leaderboard: (
    type: string,
    page: number
  ) => LeaderboardEntry[] | undefined;
  current_account_ranking: (
    type: string
  ) => LeaderboardRankInformation | undefined;

  addToStats: (response: Record<string, AggregatedStats>) => void;
  get_cached_stats: (account: string) => AggregatedStats | null;
};

export const useLeaderboard = create<LeaderboardState>((set, get) => ({
  current_time_frame: "Daily",
  set_time_frame: (sortedBy) => {
    set({ current_time_frame: sortedBy });
  },

  _pageInfo: {
    page: 1,
    pageSize: 10,
    totalPages: 0,
    totalResults: 0,
    sortBy: "EliminationAll",
  },
  setPageInfo: (pageInfo) => {
    set({ _pageInfo: pageInfo });
  },
  _page: 1,
  nextPage: () => {
    const _page = get()._page;
    set({ _page: _page + 1 });
  },
  prevPage: () => {
    if (get()._page <= 1) return;
    const _page = get()._page;
    set({ _page: _page - 1 });
  },
  resetPage: () => {
    set({ _page: 1 });
  },
  set_page: (page) => {
    set({ _page: page });
  },
  _set: new Map(),
  _setMe: new Map(),
  _cached_stats: new Map(),
  current_sort_key: "EliminationAll",
  set_sort_key: (sortedBy) => {
    set({ current_sort_key: sortedBy });
  },
  populateLeaderboard: (type, leaderboard, page) => {
    const _set = get()._set;
    let currentLeaderboard = _set.get(type);
    if (!currentLeaderboard) {
      _set.set(type, []);
      currentLeaderboard = _set.get(type);
    }
    if (!currentLeaderboard) return;
    currentLeaderboard[page] = leaderboard;
    _set.set(type, currentLeaderboard);
    set({ _set });
  },
  populateMe: (type, entry) => {
    const _set = get()._setMe;
    _set.set(type, entry);
    set({ _setMe: _set });
  },
  get_leaderboard: (type, page) => {
    const _set = get()._set;
    const currentLeaderboard = _set.get(type);
    if (!currentLeaderboard) return undefined;
    return currentLeaderboard[page];
  },
  current_account_ranking: (type) => {
    const _set = get()._setMe;
    return _set.get(type);
  },
  addToStats: (response) => {
    const cached = get()._cached_stats;

    Object.values(response).forEach((entry) => {
      cached.set(entry.account, entry);
    });

    set({ _cached_stats: cached });
  },

  get_cached_stats: (account) => {
    const _set = get()._cached_stats;
    const stat = _set.get(account);
    if (!stat) return null;
    return stat;
  },
}));
