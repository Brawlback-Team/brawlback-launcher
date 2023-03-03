import type { Mod } from "@settings/types";
import create from "zustand";
import { combine } from "zustand/middleware";

// get mods config from settings file
const initialState = window.electron.settings.getAppSettingsSync();
let selectedMod = window.electron.settings.getAppSettingsSync().settings.selectedMod;
console.log("initial state: ", initialState);

type ModState = { mods: Mod[] };

export const useMods = create(
  combine(
    {
      mods: initialState.mods,
    },
    (set) => ({
      updateMods: (modList: ModState) => set(() => modList),
    }),
  ),
);

export const useModsList = () => {
  const mods = useMods((store) => store);
  const addMod = async (modVals: Mod) => {
    await window.electron.settings.addNewMod(modVals);
    mods.updateMods({ ...mods, mods: [...mods.mods, modVals] });
  };
  const deleteMod = async (index: number) => {
    console.log("deleting", index);
    if (index < mods.mods.length) {
      console.log("inside delete");
      await window.electron.settings.deleteMod(index);
      mods.updateMods({ ...mods, mods: mods.mods.slice(0, index) });
    }
  };
  const selectMod = async (index: number) => {
    initialState.settings.selectedMod = index;
    selectedMod = index;
    await window.electron.dolphin.setMod(index);
  };
  const getSelectedMod = () => {
    if (mods.mods[selectedMod]) {
      return selectedMod;
    } else {
      initialState.settings.selectedMod = 0;
      selectedMod = 0;
      return selectedMod;
    }
  };
  return [mods.mods, addMod, deleteMod, selectMod, getSelectedMod] as const;
};
