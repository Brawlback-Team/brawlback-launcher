/* eslint-disable import/no-default-export */
import type { PaletteMode } from "@mui/material";
import { ipcRenderer } from "electron";

import {
  ipc_addNewConnection,
  ipc_addNewMod,
  ipc_deleteConnection,
  ipc_deleteMod,
  ipc_editConnection,
  ipc_getModList,
  ipc_openSettingsModalEvent,
  ipc_setAutoUpdateLauncher,
  ipc_setExtraSlpPaths,
  ipc_setIsoPath,
  ipc_setLaunchMeleeOnPlay,
  ipc_setNetplayDolphinPath,
  ipc_setPlaybackDolphinPath,
  ipc_setRootSlpPath,
  ipc_setSpectateSlpPath,
  ipc_setThemeMode,
  ipc_settingsUpdatedEvent,
  ipc_setUseMonthlySubfolders,
} from "./ipc";
import type { AppSettings, Mod, StoredConnection } from "./types";

export default {
  getAppSettingsSync() {
    return ipcRenderer.sendSync("getAppSettingsSync") as AppSettings;
  },
  async getModsList(): Promise<Mod[]> {
    const { result } = await ipc_getModList.renderer!.trigger({});
    return result;
  },
  async addNewMod(mod: Mod): Promise<void> {
    await ipc_addNewMod.renderer!.trigger({ mod });
  },
  async deleteMod(id: number): Promise<void> {
    await ipc_deleteMod.renderer!.trigger({ id });
  },
  onSettingsUpdated(handle: (settings: AppSettings) => void) {
    const { destroy } = ipc_settingsUpdatedEvent.renderer!.handle(async (settings) => {
      handle(settings);
    });
    return destroy;
  },
  onOpenSettingsPageRequest(handle: () => void) {
    const { destroy } = ipc_openSettingsModalEvent.renderer!.handle(async () => {
      handle();
    });
    return destroy;
  },
  async setThemeMode(mode: PaletteMode): Promise<void> {
    await ipc_setThemeMode.renderer!.trigger({ mode });
  },
  async setIsoPath(isoPath: string | null): Promise<void> {
    await ipc_setIsoPath.renderer!.trigger({ isoPath });
  },
  async setRootSlpPath(rootSlpPath: string): Promise<void> {
    await ipc_setRootSlpPath.renderer!.trigger({ path: rootSlpPath });
  },
  async setUseMonthlySubfolders(toggle: boolean): Promise<void> {
    await ipc_setUseMonthlySubfolders.renderer!.trigger({ toggle });
  },
  async setSpectateSlpPath(spectateSlpPath: string): Promise<void> {
    await ipc_setSpectateSlpPath.renderer!.trigger({ path: spectateSlpPath });
  },
  async setExtraSlpPaths(paths: string[]): Promise<void> {
    await ipc_setExtraSlpPaths.renderer!.trigger({ paths });
  },
  async setNetplayDolphinPath(netplayDolphinPath: string): Promise<void> {
    await ipc_setNetplayDolphinPath.renderer!.trigger({ path: netplayDolphinPath });
  },
  async setPlaybackDolphinPath(playbackDolphinPath: string): Promise<void> {
    await ipc_setPlaybackDolphinPath.renderer!.trigger({ path: playbackDolphinPath });
  },
  async setLaunchMeleeOnPlay(launchMelee: boolean): Promise<void> {
    await ipc_setLaunchMeleeOnPlay.renderer!.trigger({ launchMelee });
  },
  async setAutoUpdateLauncher(autoUpdateLauncher: boolean): Promise<void> {
    await ipc_setAutoUpdateLauncher.renderer!.trigger({ autoUpdateLauncher });
  },
  async addNewConnection(connection: Omit<StoredConnection, "id">): Promise<void> {
    await ipc_addNewConnection.renderer!.trigger({ connection });
  },
  async editConnection(id: number, connection: Omit<StoredConnection, "id">): Promise<void> {
    await ipc_editConnection.renderer!.trigger({ id, connection });
  },
  async deleteConnection(id: number): Promise<void> {
    await ipc_deleteConnection.renderer!.trigger({ id });
  },
};
