import { app } from "electron";
import path from "path";

import type { Mod, ModConfig } from "./types";

const modsDir = path.join(app.getPath("userData"), "mods");

export const defaultModList: Mod[] = [
  {
    name: "vBrawl",
    elfPath: path.join(modsDir, "vBrawl", "vBrawl Launcher.elf"),
    sdCardPath: path.join(modsDir, "vBrawl", "sd.raw"),
    lylatID: "lylat-vBrawl-id",
  },
  {
    name: "P+",
    elfPath: path.join(modsDir, "Project +", "Project + Launcher.elf"),
    sdCardPath: path.join(modsDir, "Project +", "sd.raw"),
    lylatID: "lylat-pplus-id",
  },
];

export const defaultModConfig: ModConfig = {
  modsPath: modsDir,
  mods: defaultModList,
  selectedMod: 0,
};
