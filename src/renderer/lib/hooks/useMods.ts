import type { Mod, ModConfig } from "@mods/types";
import create from "zustand";
import { combine } from "zustand/middleware";

// get mods config from settings file
const initialState: ModConfig = window.electron.mods.getModsConfigSync();
let selectedMod = window.electron.settings.getAppSettingsSync().settings.selectedMod;
console.log("initial state: ", initialState);

export const useMods = create(
  combine(
    {
      ...initialState,
    },
    (set) => ({
      updateMods: (modList: ModConfig) => set(() => modList),
    }),
  ),
);

export const useModsList = () => {
  const modSettings = useMods((store) => store);
  const modsList = modSettings.mods;
  const addMod = async (modVals: Mod) => {
    await window.electron.mods.addNewMod(modVals);
  };
  const deleteMod = async (index: number) => {
    console.log("deleting", index);
    if (index < modsList.length) {
      console.log("inside delete");
      await window.electron.mods.deleteMod(index);
    }
  };
  const selectMod = async (index: number) => {
    initialState.selectedMod = index;
    selectedMod = index;
    await window.electron.mods.setSelectedMod(index);
  };
  const getSelectedMod = () => {
    return selectedMod;
  };
  return [modsList, addMod, deleteMod, selectMod, getSelectedMod] as const;
};
