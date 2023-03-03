import { DefaultMods } from "@settings/types";

export interface FetchModLatestVersionResponse {
  version: number;
  downloadUrl?: string;
}

export const fetchModLatestVersion = async (mod: DefaultMods) => {
  //TODO add api calls
  switch (mod) {
    case DefaultMods.vBrawl:
      return {
        version: 3.0,
        downloadUrl:
          "https://github.com/Brawlback-Team/vBrawlLauncherReleases/releases/download/3.0/Vanilla.V3.Launcher.+.SD.zip",
      };
    case DefaultMods.ProjectPlus:
      return {
        version: 3.0,
      };
  }
};

import log from "electron-log";
import path from "path";
import { download } from "utils/download";
import { fileExists } from "utils/fileExists";

export async function downloadLatestMod(
  downloadUrl: string,
  destinationFolder: string,
  onProgress?: (current: number, total: number) => void,
): Promise<string> {
  const parsedUrl = new URL(downloadUrl);
  const filename = path.basename(parsedUrl.pathname);
  const downloadLocation = path.join(destinationFolder, filename);
  const exists = await fileExists(downloadLocation);
  console.dir(exists);
  if (!exists) {
    log.info(`Downloading ${downloadUrl} to ${downloadLocation}`);
    await download({
      url: downloadUrl,
      destinationFile: downloadLocation,
      overwrite: true,
      onProgress: ({ transferredBytes, totalBytes }) => onProgress && onProgress(transferredBytes, totalBytes),
    });
    log.info(`Successfully downloaded ${downloadUrl} to ${downloadLocation}`);
  } else {
    log.info(`${downloadLocation} already exists. Skipping download.`);
  }
  return downloadLocation;
}

import AdmZip from "adm-zip";
import * as fs from "fs-extra";

export async function installMod({
  assetPath,
  destinationFolder,
  metadata,
  log = console.log,
}: {
  assetPath: string;
  destinationFolder: string;
  metadata: FetchModLatestVersionResponse;
  log?: (message: string) => void;
}) {
  log(`${destinationFolder} Deleting...`);
  await fs.remove(destinationFolder).catch((_e) => null);

  const zip = new AdmZip(assetPath);
  zip.extractAllTo(destinationFolder, true);
  fs.writeJSONSync(path.join(destinationFolder, "metadata.json"), metadata);
}
