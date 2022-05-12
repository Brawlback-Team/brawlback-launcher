import type { PaletteMode } from "@mui/material";
export interface StoredConnection {
  id: number;
  ipAddress: string;
  folderPath: string;
  isRealtime: boolean;
  port?: number;
  consoleNick?: string;
  enableAutoSwitcher: boolean;
  obsIP?: string;
  obsSourceName?: string;
  obsPassword?: string;
  enableRelay: boolean;
  useNicknameFolders: boolean;
}

export type Mod = {
  elfPath: string;// path for launcher of the mod
  sdCardPath: string;// path for sd card with codes for specific mod
  name: string;
}

export type AppSettings = {
  previousVersion?: string;
  connections: StoredConnection[];// connections used for console restreaming (from slippi)
  settings: {
    theme: PaletteMode;// theme used by renderer
    isoPath: string | null;// path to brawl iso
    rootSlpPath: string;// path for stored replays (from slippi)
    useMonthlySubfolders: boolean;// whether to store replays in monthly format (from slippi)
    spectateSlpPath: string;// replays from spectating (from slippi)
    extraSlpPaths: string[];// (from slippi)
    netplayDolphinPath: string;// (from slippi)
    playbackDolphinPath: string;// (from slippi)
    dolphinPath: string;// brawlback uses single dolphin build for netplay and replays
    launchMeleeOnPlay: boolean;// Whether to launch dolphin app or launch game (from slippi)
    autoUpdateLauncher: boolean;// (from slippi)
    selectedMod: number;// index of last played mod to be auto selected
  };
  mods: Mod[];
};
