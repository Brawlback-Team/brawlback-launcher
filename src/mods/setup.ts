import { ipcMain } from "electron";

import { ipc_addNewMod, ipc_deleteMod } from "./ipc";
import type { ModsManager } from "./modsManager";

export default function setupModsIpc({ modsManager }: { modsManager: ModsManager }) {
  ipcMain.on("getModsConfigSync", (event) => {
    const modsList = modsManager.get();
    event.returnValue = modsList;
  });

  ipc_addNewMod.main!.handle(async ({ mod }) => {
    await modsManager.addNewMod(mod);
    return { success: true };
  });

  ipc_deleteMod.main!.handle(async ({ id }) => {
    await modsManager.deleteMod(id);
    return { success: true };
  });
}
