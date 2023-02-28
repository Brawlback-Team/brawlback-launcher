import type { GameStartType, MetadataType } from "@common/brawlback-js";

export interface FileResult {
  name: string;
  fullPath: string;
  settings: GameStartType;
  startTime: string | null;
  lastFrame: number | null;
  metadata: MetadataType | null;
}

export interface FolderResult {
  name: string;
  fullPath: string;
  subdirectories: FolderResult[];
}

export interface FileLoadResult {
  files: FileResult[];
  totalBytes: number;
  fileErrorCount: number;
}

export interface Progress {
  current: number;
  total: number;
}
