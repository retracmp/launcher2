import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export enum LauncherStage {
  NoToken,
  TestingToken,
  AllGood,
}

type UserManager = {
  _token: string | null;
  _token_expires_at: Date | null;
  _refresh_token: string | null;

  _user: User | null;
  otp: string | null;
  set_otp: (otp: string | null) => void;

  // user_best_donation_tier: () =>
  //   | (typeof DONATION_TIERS)[keyof typeof DONATION_TIERS]
  //   | null;
  // has_any_donation_tier: () => boolean;
  is_dev: () => boolean;
  set_new_username: (username: string) => void;

  _stage: LauncherStage;
  set_stage: (stage: LauncherStage) => void;

  access: () => boolean;
  loading: () => boolean;

  login: (token: string, expires: Date, refresh: string) => void;
  logout: () => void;
  load: (user: User) => void;

  _season: number | null;
  set_season: (season: number) => void;
};

export const useUserManager = create<UserManager>()(
  persist(
    (set, get) => ({
      _token: null,
      _token_expires_at: null,
      _refresh_token: null,
      _user: null,

      is_dev: () => {
        const user = get()._user;
        if (user === null) return false;

        return user.account.perks["launcher.developer_panel"] != undefined;
      },

      set_new_username: (username) => {
        const user = get()._user;
        if (user === null) return;

        user.account.display_name = username;
        set({ _user: user });
      },

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

      otp: null,
      set_otp: (otp) => {
        set({ otp });
      },
    }),
    {
      name: "token",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        _token: s._token,
        _token_expires_at: s._token_expires_at,
        _refresh_token: s._refresh_token,
      }),
    }
  )
);
