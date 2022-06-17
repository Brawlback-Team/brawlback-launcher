import electronSettings from "electron-settings";
import fs from "fs";
import merge from "lodash/merge";
import set from "lodash/set";

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

  constructor() {
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

  // sets variable of Mod while also sending update event to renderer
  private async _set(objectPath: string, value: any) {
    await electronSettings.set(objectPath, value);
    set(this.modSettings, objectPath, value);
    await ipc_modListUpdatedEvent.main!.trigger(this.get());
  }
}
