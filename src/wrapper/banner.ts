import { create } from "zustand";

export const bannerColours = {
  red: [
    "flex flex-row items-center p-1.5 w-full bg-red-500/20 border-1 border-solid border-red-500/20",
    "text-neutral-300 font-plex text-[14px] leading-3.5 text-base",
  ],
  blue: [
    "flex flex-row items-center p-1.5 w-full bg-blue-500/20 border-1 border-solid border-blue-500/20",
    "text-neutral-300 font-plex text-[14px] leading-3.5 text-base",
  ],
  green: [
    "flex flex-row items-center p-1.5 w-full bg-green-500/20 border-1 border-solid border-green-500/20",
    "text-neutral-300 font-plex text-[14px] leading-3.5 text-base",
  ],
  yellow: [
    "flex flex-row items-center p-1.5 w-full bg-yellow-500/20 border-1 border-solid border-yellow-500/20",
    "text-neutral-300 font-plex text-[14px] leading-3.5 text-base",
  ],
  pink: [
    "flex flex-row items-center p-1.5 w-full bg-pink-500/20 border-1 border-solid border-pink-500/20",
    "text-neutral-300 font-plex text-[14px] leading-3.5 text-base",
  ],
};

export type BannerT = {
  id: string;
  text: string;
  closable: boolean;
  colour: keyof typeof bannerColours;
};

type BannerManager = {
  _banners: Record<string, BannerT>;

  push(banner: BannerT): void;
  remove(id: string): void;
};

export const useBannerManager = create<BannerManager>()((set) => ({
  _banners: {},

  push: (banner) =>
    set((state) => ({ _banners: { ...state._banners, [banner.id]: banner } })),
  remove: (id) =>
    set((state) => ({
      _banners: Object.fromEntries(
        Object.entries(state._banners).filter(([key]) => key !== id)
      ),
    })),
}));
