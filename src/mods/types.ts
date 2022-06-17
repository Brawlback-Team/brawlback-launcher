export type LylatSettings = {
  id: string; // ID for game used by Lylat enet api
  name: string; // name of game listed on lylat (should all be brawl but just in case)
  subGameName: string; // e.g. vBrawl, P+, PM
  subGameVersion: string; // version of mod
};

export type Mod = {
  elfPath: string; // path for launcher of the mod
  sdCardPath: string; // path for sd card with codes for specific mod
  name: string; // name of mod (user changeable)
  lylatID?: string; // lylat id of mod
};

export type ModConfig = {
  modsPath: string; // path to mods folder
  mods: Mod[]; // list of mods
  selectedMod: number;
};
