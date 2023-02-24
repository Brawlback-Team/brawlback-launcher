import { addElfPath, addSdCardPath } from "@dolphin/config/config";
import { IniFile } from "@dolphin/config/iniFile";
import type { DolphinManager } from "@dolphin/manager";
import { DolphinLaunchType } from "@dolphin/types";
import electronSettings from "electron-settings";
import fs from "fs";
import merge from "lodash/merge";
import set from "lodash/set";
import path from "path";

import { defaultModConfig } from "./defaultMods";
import { ipc_modListUpdatedEvent } from "./ipc";
import type { Mod, ModConfig } from "./types";

electronSettings.configure({
  fileName: "Settings",
  prettify: true,
});

export class ModsManager {
  // only stores modified mods list
  private modSettings: Partial<ModConfig>;
  // Both replay and online ini paths will be modified to change mod
  constructor(private dolphinManger: DolphinManager) {
    if (!electronSettings.hasSync("mods")) {
      electronSettings.setSync("mods", defaultModConfig);
    }
    const restoredSettings = electronSettings.getSync("mods") as Partial<ModConfig>;

    // check to make launcher .elf path and sd card path exist
    restoredSettings.mods?.filter((mod: Partial<Mod>) => {
      if (mod.elfPath && mod.sdCardPath) {
        if (fs.existsSync(mod.elfPath) && fs.existsSync(mod.sdCardPath)) {
          return true;
        }
      }
      return false;
    });
    this.modSettings = restoredSettings;
  }

  public get(): ModConfig {
    // Join the settings with our default settings.
    // This allows us to change the defaults without persisting them
    // into the storage.
    return merge({}, defaultModConfig, this.modSettings);
  }

  public async addNewMod(mod: Mod): Promise<void> {
    const modList = this.get().mods;
    modList.push(mod);
    await this._set("mods", modList);
  }
  public async deleteMod(id: number): Promise<void> {
    const modList = this.get().mods;
    if (id < modList.length) {
      modList.splice(id, 1);
      await this._set("mods", modList);
    }
  }

  public async setSelectedMod(id: number): Promise<void> {
    const modList = this.get().mods;
    const iniFilePaths = [
      this.dolphinManger.getInstallation(DolphinLaunchType.PLAYBACK).getIniFilePath(),
      this.dolphinManger.getInstallation(DolphinLaunchType.NETPLAY).getIniFilePath(),
    ];
    if (id < modList.length) {
      await this._set("selectedMod", id);
      for (const iniFilePath of iniFilePaths) {
        const iniFile = await IniFile.init(iniFilePath);
        await addElfPath(iniFile, path.dirname(modList[id].elfPath));
        await addSdCardPath(iniFile, modList[id].sdCardPath);
      }
    }
  }
  // sets variable of Mod while also sending update event to renderer
  private async _set(objectPath: string, value: any) {
    await electronSettings.set(objectPath, value);
    set(this.modSettings, objectPath, value);
    await ipc_modListUpdatedEvent.main!.trigger(this.get());
  }
}
