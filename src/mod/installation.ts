import type { DefaultMods } from "@settings/types";
import { app } from "electron";
import log from "electron-log";
import * as fs from "fs-extra";
import path from "path";

import type { FetchModLatestVersionResponse } from "./util";
import { downloadLatestMod, fetchModLatestVersion, installMod } from "./util";

export class ModInstallation {
  constructor(private mod: DefaultMods, private defaultModsDir: string) {}
  public async validate({
    onProgress,
    onComplete,
  }: {
    onProgress: (current: number, total: number) => void;
    onComplete: () => void;
  }): Promise<void> {
    const modInfo = await fetchModLatestVersion(this.mod);
    try {
      const metadata = fs.readJSONSync(path.join(this.defaultModsDir, this.mod.toString(), "metadata.json"));
      log.info(`Found existing ${this.mod}`);
      log.info(`Checking if we need to update ${this.mod} Dolphin`);
      const latestVersion = modInfo.version;
      const isOutdated = await this._isOutOfDate(latestVersion, metadata["version"]);
      if (!isOutdated) {
        log.info("No update found...");
        onComplete();
        return;
      }

      log.info(`${this.mod} installation is outdated. Downloading latest...`);
    } catch (err) {
      console.dir(err);
      log.info(`Could not find ${this.mod} installation. Downloading...`);
    }

    // Start the download
    await this.downloadAndInstall({
      modVersion: modInfo,
      onProgress,
      onComplete,
    });
  }

  public async downloadAndInstall({
    modVersion,
    onProgress,
    onComplete,
  }: {
    modVersion?: FetchModLatestVersionResponse;
    onProgress?: (current: number, total: number) => void;
    onComplete?: () => void;
    cleanInstall?: boolean;
  }): Promise<void> {
    let modDownloadInfo = modVersion;
    if (!modDownloadInfo) {
      modDownloadInfo = await fetchModLatestVersion(this.mod);
    }

    const downloadUrl = modDownloadInfo.downloadUrl;
    if (!downloadUrl) {
      throw new Error(`Could not find latest Mod ${this.mod}`);
    }

    const downloadDir = path.join(app.getPath("userData"), "temp");
    const downloadedAsset = await downloadLatestMod(downloadUrl, downloadDir, onProgress);
    log.info(`Installing v${modDownloadInfo.version} ${this.mod} Mod...`);
    await this._installMod(downloadedAsset, modDownloadInfo);
    log.info(`Finished v${modDownloadInfo.version} ${this.mod} Mod install`);

    if (onComplete) {
      onComplete();
    }
  }

  private async _isOutOfDate(latestVersion: number, metadataVersion: number): Promise<boolean> {
    return metadataVersion < latestVersion;
  }

  // private async _uninstallMod() {
  //   await fs.remove(path.join(this.defaultModsDir, this.mod.toString()));
  // }

  private async _installMod(assetPath: string, downloadInfo: FetchModLatestVersionResponse) {
    await installMod({
      assetPath,
      destinationFolder: path.join(this.defaultModsDir, this.mod.toString()),
      metadata: downloadInfo,
    });
    await fs.remove(assetPath).catch((err) => {
      log.error(`Could not delete mod asset: ${err}`);
    });
  }
}
