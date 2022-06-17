/* eslint-disable import/no-default-export */
import { ipcRenderer } from "electron";

import { 
  ipc_addNewMod,
  ipc_deleteMod,
  ipc_modListUpdatedEvent
 } from "./ipc";
import type { ModConfig, Mod } from "./types";

export default {
  getModsConfigSync(): ModConfig {
    return ipcRenderer.sendSync("getModsConfigSync") as ModConfig;
  },
  async addNewMod(mod: Mod): Promise<void> {
    await ipc_addNewMod.renderer!.trigger({ mod });
  },
  async deleteMod(id: number): Promise<void> {
    await ipc_deleteMod.renderer!.trigger({ id });
  },
  onModsListUpdated(handle: (modList: ModConfig) => void) {
    const { destroy } = ipc_modListUpdatedEvent.renderer!.handle(async (modList) => {
      handle(modList);
    });
    return destroy;
  },
};
