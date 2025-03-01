type Item = {
  ID: string;
  ProfileType: string;
  Attributes: Record<string, any>;
  BackendValue: string;
  Template: string;
  Quantity: number;
};

type Loadout = {
  ID: string;
  ProfileID: string;
  LockerName: string;
  CharacterID: string;
  BackpackID: string;
  PickaxeID: string;
  GliderID: string;
  ContrailID: string;
  LoadingScreenID: string;
  MusicPackID: string;
  DanceIDs: string[6];
  WrapIDs: string[7];
  BannerColour: string;
  BannerIcon: string;
};

type Profile = {
  Items: Record<string, Item>;
  Loadouts: Loadout[];
  Attributes: Record<string, any>;
};

type StatMatch = {
  ID: string;
  Eliminations: number;
  Placement: number;
  TeamType: "solo" | "duo" | "trio" | "squad";
  TimeAlive: string;
};

type Stat = {
  Season: number;
  XP: number;
  BookXP: number;
  Premium: bool;
  Matches: Record<string, StatMatch>;
  TierFreeClaimed: number;
  TierPaidClaimed: number;
  LevelClaimed: number;
  PersistentScores: Record<string, number>;
  Tokens: string[];
};

type User = {
  ID: string;
  Account: {
    DisplayName: string;
    Discord: {
      Username: string;
    };
    Stats: Record<int, Stat>;
    State: {
      Packages: string[];
      ClaimedPackages: Record<string, string>;
    };
  };
  Profiles: {
    athena: Profile;
    common_core: Profile;
  };
};

type LauncherNewsItem = {
  updateType: string;
  title: string;
  date: string;
  body: string;
  authors: string;
};
