//import type { StatsType } from "@common/brawlback-js";
import { _, makeEndpoint } from "utils/ipc";

import type { FileLoadResult, FolderResult, Progress } from "./types";

// Handlers

export const ipc_loadReplayFolder = makeEndpoint.main("loadReplayFolder", <{ folderPath: string }>_, <FileLoadResult>_);

export const ipc_initializeFolderTree = makeEndpoint.main(
  "initializeFolderTree",
  <{ folders: readonly string[] }>_,
  <readonly FolderResult[]>_,
);

export const ipc_selectTreeFolder = makeEndpoint.main(
  "selectTreeFolder",
  <{ folderPath: string }>_,
  <readonly FolderResult[]>_,
);

// Events

export const ipc_loadProgressUpdatedEvent = makeEndpoint.renderer("replays_loadProgressUpdated", <Progress>_);

export const ipc_statsPageRequestedEvent = makeEndpoint.renderer("replays_showStatsPage", <{ filePath: string }>_);
