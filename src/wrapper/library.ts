import invoke from "src/tauri";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useOptions } from "./options";
import { useUserManager } from "./user";
import socketExport from "src/socket/export";
import { useApplicationInformation } from "./tauri";
import { useRetrac } from "./retrac";

export const VERSION_SWAPS: Record<string, string> = {
  "++Fortnite+Release-Live-CL-3724489": "++Fortnite+Release-1.8-CL-3724489",
};

export const BUILD_NICE_NAMES: Record<string, string> = {
  "++Fortnite+Release-OT6.5-CL-2870186": "OT6.5",
  "++Fortnite+Release-Cert-CL-3532353": "Cert",
  "++Fortnite+Release-Live-CL-3541083": "Alpha",
  "++Fortnite+Release-Live-CL-3700114": "Season 1",
  "++Fortnite+Release-Live-CL-3729133": "Season 1",
  "++Fortnite+Release-Live-CL-3741772": "Season 1",
  "++Fortnite+Release-Live-CL-3757339": "Season 1",
  "++Fortnite+Release-Live-CL-3775276": "Season 1",
  "++Fortnite+Release-1.8-CL-3724489": "Season 1",
  "++Fortnite+Release-1.10-CL-3790078": "Season 1",
  "++Fortnite+Release-1.11-CL-3807424": "Season 2",
  "++Fortnite+Release-2.1.0-CL-3825894": "Season 2",
  "++Fortnite+Release-2.2.0-CL-3841827": "Season 2",
  "++Fortnite+Release-2.3.0-CL-3847564": "Season 2",
  "++Fortnite+Release-2.4.0-CL-3858292": "Season 2",
  "++Fortnite+Release-2.4.2-CL-3870737": "Season 2",
  "++Fortnite+Release-2.5.0-CL-3889387": "Season 2",
  "++Fortnite+Release-3.0-CL-3901517": "Season 3",
  "++Fortnite+Release-3.1-CL-3915963": "Season 3",
  "++Fortnite+Release-3.1-CL-3917250": "Season 3",
  "++Fortnite+Release-3.2-CL-3935073": "Season 3",
  "++Fortnite+Release-3.3-CL-3942182": "Season 3",
  "++Fortnite+Release-3.5-CL-4008490": "Season 3",
  "++Fortnite+Release-3.6-CL-4019403": "Season 3",
  "++Fortnite+Release-4.0-CL-4039451": "Season 4",
  "++Fortnite+Release-4.1-CL-4053532": "Season 4",
  "++Fortnite+Release-4.2-CL-4072250": "Season 4",
  "++Fortnite+Release-4.4-CL-4117433": "Season 4",
  "++Fortnite+Release-4.4.1-CL-4127312": "Season 4",
  "++Fortnite+Release-4.5-CL-4159770": "Season 4",
  "++Fortnite+Release-5.00-CL-4204761": "Season 5",
  "++Fortnite+Release-5.00-CL-4214610": "Season 5",
  "++Fortnite+Release-5.10-CL-4240749": "Season 5",
  "++Fortnite+Release-5.21-CL-4288479": "Season 5",
  "++Fortnite+Release-5.30-CL-4305896": "Season 5",
  "++Fortnite+Release-5.40-CL-4352937": "Season 5",
  "++Fortnite+Release-5.41-CL-4363240": "Season 5",
  "++Fortnite+Release-6.00-CL-4395664": "Season 6",
  "++Fortnite+Release-6.00-CL-4402180": "Season 6",
  "++Fortnite+Release-6.01-CL-4417689": "Season 6",
  "++Fortnite+Release-6.01-CL-4424678": "Season 6",
  "++Fortnite+Release-6.02-CL-4442095": "Season 6",
  "++Fortnite+Release-6.02-CL-4461277": "Season 6",
  "++Fortnite+Release-6.10-CL-4464155": "Season 6",
  "++Fortnite+Release-6.10-CL-4476098": "Season 6",
  "++Fortnite+Release-6.10-CL-4480234": "Season 6",
  "++Fortnite+Release-6.20-CL-4497486": "Season 6",
  "++Fortnite+Release-6.21-CL-4526925": "Season 6",
  "++Fortnite+Release-6.22-CL-4543176": "Season 6",
  "++Fortnite+Release-6.30-CL-4573096": "Season 6",
  "++Fortnite+Release-6.31-CL-4573279": "Season 6",
  "++Fortnite+Release-7.00-CL-4629139": "Season 7",
  "++Fortnite+Release-7.10-CL-4667333": "Season 7",
  "++Fortnite+Release-7.20-CL-4727874": "Season 7",
  "++Fortnite+Release-7.30-CL-4834550": "Season 7",
  "++Fortnite+Release-7.40-CL-5046157": "Season 7",
  "++Fortnite+Release-8.00-CL-5203069": "Season 8",
  "++Fortnite+Release-8.50-CL-6058028": "Season 8",
  "++Fortnite+Release-8.51-CL-6165369": "Season 8",
  "++Fortnite+Release-9.00-CL-6337466": "Season 9",
  "++Fortnite+Release-9.01-CL-6428087": "Season 9",
  "++Fortnite+Release-9.10-CL-6639283": "Season 9",
  "++Fortnite+Release-9.21-CL-6922310": "Season 9",
  "++Fortnite+Release-9.30-CL-7095426": "Season 9",
  "++Fortnite+Release-9.40-CL-7315705": "Season 9",
  "++Fortnite+Release-9.41-CL-7609292": "Season 9",
  "++Fortnite+Release-10.00-CL-7704164": "Season X",
  "++Fortnite+Release-10.10-CL-7955722": "Season X",
  "++Fortnite+Release-10.20-CL-8456527": "Season X",
  "++Fortnite+Release-10.31-CL-8723043": "Season X",
  "++Fortnite+Release-10.40-CL-9380822": "Season X",
  "++Fortnite+Release-11.00-CL-9603448": "Chapter 2 Season 1",
  "++Fortnite+Release-12.41-CL-12905909": "Chapter 2 Season 2",
  "++Fortnite+Release-13.40-CL-14113327": "Chapter 2 Season 3",
  "++Fortnite+Release-14.40-CL-14550713": "Chapter 2 Season 4",
  "++Fortnite+Release-14.60-CL-14786821": "Chapter 2 Season 4",
};

export const DOWNLOAD_FILE_NICE_NAMES: Record<string, string> = {
  Custom_Content: "Retrac Custom Content",
  Anticheat_Client: "Secure Anti-cheat Client",
  EAC_Client: "Easy Anti-cheat",
};

export const LAUNCH_STATE = {
  NONE: "none",
  LAUNCHING: "launching",
  LAUNCHED: "launched",
  CLOSING: "closing",
} as const;

type LibraryState = {
  library: LibraryEntry[];
  addLibraryEntry: (entry: LibraryEntry) => void;
  removeLibraryEntry: (version: string) => void;
  updateLibraryEntry: (version: string, entry: Partial<LibraryEntry>) => void;
  clearLibrary: () => void;
  createLibraryEntry: (rootPath: string) => Promise<LibraryEntry>;
  createLibraryEntryWithManifestID: (
    rootPath: string,
    m: string
  ) => Promise<LibraryEntry>;

  launchState: (typeof LAUNCH_STATE)[keyof typeof LAUNCH_STATE];
  setLaunchState: (
    state: (typeof LAUNCH_STATE)[keyof typeof LAUNCH_STATE]
  ) => void;

  launchedBuild: LibraryEntry | null;
  setLaunchedBuild: (build: LibraryEntry | null) => void;

  launchBuild: (version: string) => Promise<void>;

  setEacInitialisedForBuild: (version: string, value: boolean) => void;
};

export const useLibrary = create<LibraryState>()(
  persist(
    (set, get) => ({
      library: [],
      addLibraryEntry: (entry) => {
        const existingEntry = get().library.find(
          (libEntry) => libEntry.version === entry.version
        );
        if (existingEntry) {
          get().removeLibraryEntry(existingEntry.version);
        }

        set((state) => ({
          library: [...state.library, entry],
        }));
      },
      removeLibraryEntry: (version) =>
        set((state) => ({
          library: state.library.filter((entry) => entry.version !== version),
        })),
      updateLibraryEntry: (version, entry) =>
        set((state) => ({
          library: state.library.map((libEntry) =>
            libEntry.version === version ? { ...libEntry, ...entry } : libEntry
          ),
        })),
      clearLibrary: () => set({ library: [] }),

      createLibraryEntry: async (rootPath) => {
        const rootPathCleaned = rootPath.replace(/\\/g, "/");

        const entry: Partial<LibraryEntry> = {
          rootLocation: rootPath,
          processLocation: `${rootPathCleaned}/FortniteGame/Binaries/Win64/FortniteClient-Win64-Shipping.exe`,
          splashLocation: `${rootPathCleaned}/FortniteGame/Content/Splash/Splash.bmp`,
        };
        const version = await invoke
          .get_fortnite_version(entry.processLocation as string)
          .catch(() => null);
        if (!version) {
          throw new Error("Invalid Fortnite installation path");
        }
        entry.version = VERSION_SWAPS[version] || version;
        entry.manifestId = `${entry.version.replace("-Windows", "")}-Windows`;

        if (!BUILD_NICE_NAMES[entry.version]) {
          throw new Error("Unsupported Fortnite version");
        }
        entry.buildName = BUILD_NICE_NAMES[entry.version];

        get().addLibraryEntry(entry as LibraryEntry);
        return entry as LibraryEntry;
      },
      createLibraryEntryWithManifestID: async (rootPath, m) => {
        const normalResult = await get().createLibraryEntry(rootPath);
        normalResult.manifestId = m;
        get().addLibraryEntry(normalResult as LibraryEntry);
        return normalResult;
      },
      launchState: LAUNCH_STATE.NONE,
      setLaunchState: (state) => set({ launchState: state }),
      launchedBuild: null,
      setLaunchedBuild: (build) => set({ launchedBuild: build }),

      launchBuild: async (version) => {
        if (get().launchState !== LAUNCH_STATE.NONE) {
          throw new Error("Cannot launch while another build is launching");
        }

        const entry = get().library.find((x) => x.version === version);
        if (!entry) {
          throw new Error("Build not found in library");
        }
        get().setLaunchedBuild(entry);
        get().setLaunchState(LAUNCH_STATE.LAUNCHING);

        if (!entry.addedToWindowsDefender) {
          const result = await invoke.add_to_defender(entry.rootLocation);
          if (result === null) {
            get().setLaunchState(LAUNCH_STATE.NONE);
            throw new Error("Failed to add to Windows Defender");
          }

          get().updateLibraryEntry(entry.version, {
            addedToWindowsDefender: true,
          });
        }

        const code = await socketExport.exchange_code();
        if (!code) {
          get().setLaunchState(LAUNCH_STATE.NONE);
          throw new Error("Failed to get exchange code");
        }

        const result = await invoke.launch_retrac({
          version: entry.version,
          launch_args: useApplicationInformation.getState().dev
            ? useOptions.getState().launch_arguments
            : "",
          exchange_code: code,
          anticheat_token: useUserManager.getState()._token || "",
          disable_pre_edits: useOptions.getState().disable_pre_edits,
          reset_on_release: useOptions.getState().reset_on_release,
          simple_edit: useOptions.getState().simple_edit,
          root: entry.rootLocation,
          manifest_id: entry.manifestId,
          anti_cheat_already_intialised:
            entry.hasIntialisedEasyAnticheat || false,
          do_not_update_paks: useRetrac.getState().do_not_download_paks,
        });

        if (result === null || !!!result) {
          get().setLaunchState(LAUNCH_STATE.NONE);
          throw new Error("Failed to launch Retrac");
        }
      },
      setEacInitialisedForBuild: (version) => {
        const entry = get().library.find((x) => x.version === version);
        if (!entry) return;
        entry.hasIntialisedEasyAnticheat = true;
        get().updateLibraryEntry(version, { hasIntialisedEasyAnticheat: true });
      },
    }),
    {
      name: "library",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        library: state.library.map((entry) => ({
          rootLocation: entry.rootLocation,
          processLocation: entry.processLocation,
          splashLocation: entry.splashLocation,
          version: entry.version,
          buildName: entry.buildName,
          manifestId: entry.manifestId,
          hasIntialisedEasyAnticheat: entry.hasIntialisedEasyAnticheat || false,
          addedToWindowsDefender: entry.addedToWindowsDefender || false,
        })),
      }),
    }
  )
);
