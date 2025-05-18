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
  TimeAlive: int;
  CreatedAt: string;
  DeathLocation: {
    X: number;
    Y: number;
  };
  EliminationLocations: Array<{
    X: number;
    Y: number;
  }>;
};

type Stat = {
  Season: number;
  XP: number;
  BookXP: number;
  Premium: boolean;
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
    Friendships: Record<
      string,
      {
        ID: string;
        Account: string;
        Friend: string;
        Status: "PENDING" | "ACCEPTED";
      }
    >;
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

type EventItem = {
  ID: string;
  DisplayID: string;
  Begins: string;
  Expire: string;
  PlaylistID: string;
  ScoreID: string;
  IsArena: boolean;
  ArenaProgressionRules: any;
  Windows: {
    ID: string;
    Round: number;
    TBD: boolean;
    CanLiveSpectate: boolean;
    Meta: Record<string, any>;
    DivisionRank: number;
    ThresholdToAdvanceDivision: number;
    Start: string;
    End: string;
    TemplateID: string;
    UseIndividualScores: boolean;
  }[];
  Templates: {
    ID: string;
    MatchLimit: number;
    PlaylistID: string;
    DivRank: number;
    PointNeeded: number;
    ScoringRules: {
      Stat: string;
      Type: string;
      Tiers: {
        Value: number;
        Points: number;
        Multiply: boolean;
      }[];
    }[];
    NextToken: string;
    PayoutTable: {
      ranks: {
        payouts: {
          quantity: number;
          rewardMode: string;
          rewardType: string;
          value: string;
        }[];
        threshold: number;
      }[];
      rolling: boolean;
      scoreId: string;
      scoringType: string;
    };
  }[];
  OnlyEnabledForPackages: boolean;
  MinimumAccountLevel: number;
  EnabledForPackages: string[];
  RegionsAllowed: string[];
};

type EventStyle = {
  tournament_display_id: string;
  title_line_1: string;
  title_line_2: string;
  schedule_info: string;
  poster_front_image: string;
  poster_back_image: string;
  flavor_description: string;
  details_description: string;
  short_format_title: string;
  long_format_title: string;
  background_title: string;
  pin_score_requirement: number;
  pin_earned_text: string;
  base_color: string;
  primary_color: string;
  secondary_color: string;
  highlight_color: string;
  title_color: string;
  shadow_color: string;
  background_left_color: string;
  background_right_color: string;
  background_text_color: string;
  poster_fade_color: string;
  playlist_tile_image: string;
  loading_screen_image: string;
  style_info_id: string;
};

type LauncherEventItem = {
  event: EventItem;
  style: EventStyle;
};

type FriendInformation = {
  accountId: string;
  displayName: string;
  discordAvatarUrl: string;
  currentEquippedCharacter: string;
};

type LeaderboardEntry = {
  accountId: string;
  sortedBy: string;
  value: number;
  displayName: string;
  otherWinValue: number;
  otherElimValue: number;
  otherHypeValue: number;
  position: number;
};

type LeaderboardPageInfo = {
  page: number;
  pageSize: number;
  totalPages: number;
  totalResults: number;
  sortBy: "eliminations" | "points" | "hype";
};

type ManifestInformation = {
  manifestId: string;
  title: string;
  imageUrl: string;
  iconUrl: string;
  gigabyteSize: number;
};

type LibraryEntry = {
  version: string;
  rootLocation: string;
  processLocation: string;
  splashLocation: string;
  buildName: string;
  manifestId: string;
};

type BackendServer = {
  alivecount: number;
  bucket_id: string;
  id: string;
  ip: string;
  maxplayercount: number;
  name: string;
  playercount: number;
  port: number;
  region: string;
  status: number;
  string_status:
    | "Initialised"
    | "AssignedParties_WaitingForGameserverSocket"
    | "GameserverConfirmedParties_CanBackfill_WaitingToMatchmake"
    | "PlayersMatchmaked_WaitingForBus"
    | "BusStarted_WaitingToEnd";
  version: string;
};
