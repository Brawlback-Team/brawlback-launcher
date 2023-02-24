/* eslint-disable import/no-default-export */
import { ipc_setSelectedMod } from "@settings/ipc";
import { ipcRenderer } from "electron";

import { ipc_addNewMod, ipc_deleteMod, ipc_modListUpdatedEvent, ipc_select_mod } from "./ipc";
import type { Mod, ModConfig } from "./types";

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
  async setSelectedMod(id: number): Promise<void> {
    await ipc_select_mod.renderer!.trigger({ id });
    await ipc_setSelectedMod.renderer!.trigger({ id });
  },
  onModsListUpdated(handle: (modList: ModConfig) => void) {
    const { destroy } = ipc_modListUpdatedEvent.renderer!.handle(async (modList) => {
      handle(modList);
    });
    return destroy;
  },
};
