type Grant = { backendType: string; quantity: number; template: string };

type Item = {
  id: string;
  attributes: {
    [key: string]: any;
  };
  grant: Grant;
  profileType: string;
};

type Loadout = {
  id: string;
  index: number;
  backpackId: string;
  bannerColorTemplateId: string;
  bannerIconTemplateId: string;
  characterId: string;
  contrailId: string;
  danceIds: string[];
  gliderId: string;
  loadingScreenId: string;
  musicPackId: string;
  name: string;
  pickaxeId: string;
  profileType: string;
  wrapIds: [];
};

type Profile = {
  type: "string";
  version: number;

  items: Record<string, Item>;
  gifts: Record<string, Gift>;
  loadouts: Record<string, Loadout>;
  attributes: Record<string, any>;
};

type Account = {
  id: string;
  display_name: string;
  connection_discord: {
    id: string;
    username: string;
    refresh_token: string;
    access_token: string;
    avatar: string;
    banner: string;
    expires_at: number;
  };
  bans: {
    [key: string]: Object;
  };
  perks: {
    [key: string]: number;
  };
  permissions: {
    [key: string]: Object;
  };
  purchases: {
    [key: string]: {
      created_at: string;
      id: string;
      purchase_processed_at: null;
      rewards: {
        [key: string]: {
          id: string;
          attributes: {};
          grant: Grant;
          profileType: string;
          variants: Object[];
        };
      };
      status: string;
      total_paid: number;
      updated_at: string;
    };
  };
};

type User = {
  ID: string;
  Account: Account;
  Profiles: {
    athena: Profile;
    collections: Profile;
    common_core: Profile;
    common_public: Profile;
    creative: Profile;
    profile0: Profile;
  };
};

type LauncherNewsItem = {
  updateType: string;
  title: string;
  date: string;
  body: string;
  authors: string;
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
  hasIntialisedEasyAnticheat: boolean;
  addedToWindowsDefender: boolean;
  triedToAddToWindowsDefender: boolean;

  order: number;
};

type Playlist = {
  asset_id: string;
  display_name: string;
  display_url: string;
  enable_match_options: boolean;
  player_cap: number;
  priority_percent: number;
  squad_size: number;
  unique_nametag: string;
};

type PoolID = {
  version: number;
  build: number;
  region: "EU" | "NAE" | "NAW" | "ME" | "OCE";
  playlist_nametag: string;
  tournament: {
    tournament_id: string;
    window_id: string;
  } | null;
};

type Match = {
  id: string;
  pool_id: PoolID;
  created_at: string;
  updated_at: string;
  custom_match_options: Object;
  live_player_count: number | null;
  reserved_player_count: number | null;
  playlist: Playlist;
  state:
    | "NotCreated"
    | "CreatedNotConnected"
    | "PostMatchmakingSession"
    | "RegisteredWithWebsocket"
    | "IntialReservationsAllocated"
    | "ConfirmedMatchAssigned"
    | "BackfillingReservations"
    | "Concluded";
  unique_port: number;
};
