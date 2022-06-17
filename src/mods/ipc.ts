//import type { EmptyPayload, SuccessPayload } from "utils/ipc";
import { _, makeEndpoint, SuccessPayload } from "utils/ipc";

import type { ModConfig, Mod } from "./types";

// Handlers
export const ipc_addNewMod = makeEndpoint.main("addNewMod", <{ mod: Mod }>_, <SuccessPayload>_);
export const ipc_deleteMod = makeEndpoint.main("deleteMod", <{ id: number }>_, <SuccessPayload>_);

// Events
export const ipc_modListUpdatedEvent = makeEndpoint.renderer("mods_modListUpdated", <ModConfig>_);
