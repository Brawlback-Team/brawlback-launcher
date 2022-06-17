import type { Mod, ModConfig } from "@mods/types";
import create from "zustand";
import { combine } from "zustand/middleware";

// get mods config from settings file
const initialState: ModConfig = window.electron.mods.getModsConfigSync();
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
  const modsList = useMods((store) => store.mods);
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
  return [modsList, addMod, deleteMod] as const;
};
