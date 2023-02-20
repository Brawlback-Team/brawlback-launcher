import { app, nativeTheme } from "electron";
import path from "path";

import type { AppSettings } from "./types";

function getDefaultRootSlpPath(): string {
  let root = app.getPath("home");
  if (process.platform === "win32") {
    root = app.getPath("documents");
  }
  return path.join(root, "Slippi");
}

export const defaultAppSettings: AppSettings = {
  connections: [],
  settings: {
    theme: nativeTheme.shouldUseDarkColors ? 'dark' : 'light',
    isoPath: null,
    rootSlpPath: getDefaultRootSlpPath(),
    useMonthlySubfolders: false,
    spectateSlpPath: path.join(getDefaultRootSlpPath(), "Spectate"),
    extraSlpPaths: [],
    netplayDolphinPath: path.join(app.getPath("userData"), "netplay"),
    playbackDolphinPath: path.join(app.getPath("userData"), "playback"),
    dolphinPath: "path/to/dolphin",
    launchMeleeOnPlay: true,
    autoUpdateLauncher: true,
    selectedMod: 0
  },
  mods: [
    {
      elfPath: 'path/to/launcher.elf',
      sdCardPath: 'path/to/sd.raw',
      name: 'P+'
    },
    {
      elfPath: 'path/to/launcher.elf',
      sdCardPath: 'path/to/sd.raw',
      name: 'vBrawl'
    }
  ]
};
