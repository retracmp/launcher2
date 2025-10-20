import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const DONATION_TIERS = {
  booster: {
    colour: "#f47fff",
    text: "Server Booster",
    tier: 1,
  },
  pubg: {
    colour: "#4e42ff",
    text: "PUBG",
    tier: 2,
  },
  fever: {
    colour: "#f14949",
    text: "Fever",
    tier: 3,
  },
  carti: {
    colour: "#ffffff",
    text: "Carti",
    tier: 4,
  },
  fncs: {
    colour: "#f1d214",
    text: "FNCS",
    tier: 5,
  },
  gamer: {
    colour: "#c3ff00",
    text: "Gamer",
    tier: 6,
  },
  llama: {
    colour: "#00ffec",
    text: "OG",
    tier: 7,
  },
  anime: {
    colour: "#fc9cfa",
    text: "Anime Legends",
    tier: 8,
  },
  tvseries: {
    colour: "#070bf5",
    text: "TV Series",
    tier: 8,
  },
  gliders: {
    colour: "#ff9cbf",
    text: "Glorious Gliders",
    tier: 8,
  },
  crystal: {
    colour: "#b135ff",
    text: "Crystal",
    tier: 9,
  },
  ultimate: {
    colour: "#ff7300",
    text: "Ultimate",
    tier: 10,
  },
};

export enum LauncherStage {
  NoToken,
  TestingToken,
  AllGood,
}

type UserManager = {
  _token: string | null;
  _user: User | null;
  otp: string | null;
  set_otp: (otp: string | null) => void;

  user_best_donation_tier: () =>
    | (typeof DONATION_TIERS)[keyof typeof DONATION_TIERS]
    | null;
  has_any_donation_tier: () => boolean;
  is_dev: () => boolean;
  set_new_username: (username: string) => void;

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

      user_best_donation_tier: () => {
        const user = get()._user;
        if (user === null) return null;

        const donationPackages = user.Account.State.Packages;
        const highestDonationPackage = donationPackages.reduce(
          (prev: string, current: string) => {
            if (!DONATION_TIERS[current as keyof typeof DONATION_TIERS])
              return prev;
            return DONATION_TIERS[current as keyof typeof DONATION_TIERS].tier >
              (
                DONATION_TIERS[prev as keyof typeof DONATION_TIERS] || {
                  tier: 0,
                }
              ).tier
              ? current
              : prev;
          },
          ""
        );
        if (!highestDonationPackage) return null;

        const donationTier =
          DONATION_TIERS[highestDonationPackage as keyof typeof DONATION_TIERS];
        return donationTier;
      },

      has_any_donation_tier: () => {
        const user = get()._user;
        if (user === null) return false;

        const donationPackages = user.Account.State.Packages;
        return donationPackages.some((pkg) => pkg in DONATION_TIERS);
      },

      is_dev: () => {
        const user = get()._user;
        if (user === null) return false;

        return user.Account.State.Packages.includes("p_all");
      },

      set_new_username: (username) => {
        const user = get()._user;
        if (user === null) return;

        user.Account.DisplayName = username;
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
      partialize: (s) => ({ _token: s._token }),
    }
  )
);
