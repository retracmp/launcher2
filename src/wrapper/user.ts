import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export enum LauncherStage {
  NoToken,
  TestingToken,
  AllGood,
}

type UserManager = {
  _token: string | null;
  _user: User | null;

  _stage: LauncherStage;
  set_stage: (stage: LauncherStage) => void;

  access: () => boolean;
  loading: () => boolean;

  login: (token: string) => void;
  logout: () => void;
  load: (user: User) => void;

  _season: number | null;
  set_season: (season: number) => void;
};

export const useUserManager = create<UserManager>()(
  persist(
    (set, get) => ({
      _token: null,
      _user: null,

      _stage: LauncherStage.NoToken,
      set_stage: (stage) => {
        set({ _stage: stage });
      },

      access: () => {
        return !!get()._token && get()._stage === LauncherStage.AllGood;
      },
      loading: () => {
        return get()._stage === LauncherStage.TestingToken;
      },

      login: (token) => {
        set({ _token: token, _stage: LauncherStage.TestingToken });
      },
      logout: () => {
        set({ _token: null, _user: null, _stage: LauncherStage.NoToken });
      },

      load: (user) => {
        set({ _user: user, _stage: LauncherStage.AllGood });
      },

      _season: 14,
      set_season: (season) => {
        set({ _season: season });
      },
    }),
    {
      name: "token",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ _token: s._token }),
    }
  )
);
