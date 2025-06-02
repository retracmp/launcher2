import { create } from "zustand";

export const bannerColours = {
  red: [
    "flex flex-row items-center p-1.5 w-full bg-red-500/20 border-1 border-solid border-red-500/20 rounded-sm min-h-[2.125rem]",
    "text-neutral-300 font-plex text-[14px] leading-3.5 text-base",
    "text-red-200 hover:bg-red-500/20",
  ],
  blue: [
    "flex flex-row items-center p-1.5 w-full bg-blue-500/20 border-1 border-solid border-blue-500/20 rounded-sm min-h-[2.125rem]",
    "text-neutral-300 font-plex text-[14px] leading-3.5 text-base",
    "text-blue-200 hover:bg-blue-500/20",
  ],
  green: [
    "flex flex-row items-center p-1.5 w-full bg-green-500/20 border-1 border-solid border-green-500/20 rounded-sm min-h-[2.125rem]",
    "text-neutral-300 font-plex text-[14px] leading-3.5 text-base",
    "text-green-200 hover:bg-green-500/20",
  ],
  yellow: [
    "flex flex-row items-center p-1.5 w-full bg-yellow-500/20 border-1 border-solid border-yellow-500/20 rounded-sm min-h-[2.125rem]",
    "text-neutral-300 font-plex text-[14px] leading-3.5 text-base",
    "text-yellow-200 hover:bg-yellow-500/20",
  ],
  pink: [
    "flex flex-row items-center p-1.5 w-full bg-pink-500/20 border-1 border-solid border-pink-500/20 rounded-sm min-h-[2.125rem]",
    "text-neutral-300 font-plex text-[14px] leading-3.5 text-base",
    "text-pink-200 hover:bg-pink-500/20",
  ],
};

export type BannerT = {
  id: string;
  text: string;
  closable: boolean;
  colour: keyof typeof bannerColours;
  link?: string;
  expireAfter?: number; // in seconds, if set, the banner will be removed after this time
};

type BannerManager = {
  _banners: Record<string, BannerT>;

  push(banner: BannerT): void;
  remove(id: string): void;
  exists(id: string): boolean;
};

export const useBannerManager = create<BannerManager>()((set, get) => ({
  _banners: {},

  push: (banner) =>
    set((state) => ({ _banners: { ...state._banners, [banner.id]: banner } })),
  remove: (id) =>
    set((state) => ({
      _banners: Object.fromEntries(
        Object.entries(state._banners).filter(([key]) => key !== id)
      ),
    })),
  exists: (id) => Object.keys(get()._banners).includes(id),
}));

export const BANNER_DEFAULTS = {
  WEBSOCKET_NULL: {
    id: "websocket",
    text: "A websocket connection could not be established, please check the status of retrac or your internet connection.",
    colour: "red",
    closable: false,
  },
  WEBSOCKET_CONNECTING: {
    id: "websocket",
    text: "Websocket connection is currently reconnecting, please wait.",
    colour: "yellow",
    closable: false,
  },
  WEBSOCKET_CLOSED: {
    id: "websocket",
    text: "Websocket connection has been closed, please check your internet connection.",
    colour: "red",
    closable: false,
  },
} as Record<string, BannerT>;
