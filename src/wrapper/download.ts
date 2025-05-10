import { create } from "zustand";

type DownloadState = {
  active_download_progress: Map<string, ManifestProgress>;
  set_active_download_progress: (
    id: string,
    progress: ManifestProgress
  ) => void;
  remove_active_download_progress: (id: string) => void;

  active_verifying_progress: Map<string, MannifestVerifyProgress>;
  set_active_verifying_progress: (
    id: string,
    progress: MannifestVerifyProgress
  ) => void;
  remove_active_verifying_progress: (id: string) => void;

  timed_metabytes: Map<string, [date: Date, value: number][]>;
  add_timed_metabytes: (
    manifest_id: string,
    time: Date,
    metabytes: number
  ) => void;
  get_timed_metabytes: (manifest_id: string) => number[];
};

export const useDownloadState = create<DownloadState>((set, get) => ({
  active_download_progress: new Map<string, ManifestProgress>(),
  set_active_download_progress: (id, progress) =>
    set((state) => {
      const newProgress = new Map(state.active_download_progress);
      newProgress.set(id, progress);
      return { active_download_progress: newProgress };
    }),
  remove_active_download_progress: (id) =>
    set((state) => {
      const newProgress = new Map(state.active_download_progress);
      newProgress.delete(id);
      return { active_download_progress: newProgress };
    }),

  active_verifying_progress: new Map<string, MannifestVerifyProgress>(),
  set_active_verifying_progress: (id, progress) =>
    set((state) => {
      const newProgress = new Map(state.active_verifying_progress);
      newProgress.set(id, progress);
      return { active_verifying_progress: newProgress };
    }),
  remove_active_verifying_progress: (id) =>
    set((state) => {
      const newProgress = new Map(state.active_verifying_progress);
      newProgress.delete(id);
      return { active_verifying_progress: newProgress };
    }),

  timed_metabytes: new Map<string, [date: Date, value: number][]>(),
  add_timed_metabytes: (manifest_id, time, metabytes) => {
    const timed_metabytes = get().timed_metabytes;
    const my_values = timed_metabytes.get(manifest_id) || [];
    my_values.push([time, metabytes]);

    const new_timed_metabytes = new Map(timed_metabytes);
    new_timed_metabytes.set(manifest_id, my_values);

    set({ timed_metabytes: new_timed_metabytes });
  },
  get_timed_metabytes: (id: string) => {
    const timed_metabytes = get().timed_metabytes;
    const my_values = timed_metabytes.get(id);
    if (!my_values) return [];

    // const metabytes: number[] = [];
    // const time_map: Map<string, number[]> = new Map();

    // for (const [time, mb] of timed_metabytes) {
    //   const time_str = time.toISOString().split(".")[0];
    //   if (!time_map.has(time_str)) {
    //     time_map.set(time_str, []);
    //   }
    //   time_map.get(time_str)?.push(mb);
    // }

    // for (const [_, values] of time_map.entries()) {
    //   const avg = values.reduce((a, b) => a + b, 0) / values.length;
    //   metabytes.push(avg);
    // }

    return my_values.map((entry) => entry[1]);
  },
}));
