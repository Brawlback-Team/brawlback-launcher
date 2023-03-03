import type { SettingsManager } from "@settings/settingsManager";
import type { DefaultMods } from "@settings/types";
import electronLog from "electron-log";
import { ModInstallation } from "mod/installation";
import { Observable, Subject } from "observable-fns";
import path from "path";
import { fileExists } from "utils/fileExists";

import { addElfPath, addSdCardPath } from "./config/config";
import { IniFile } from "./config/iniFile";
import { DolphinInstallation } from "./install/installation";
import { DolphinInstance, PlaybackDolphinInstance } from "./instance";
import type { DolphinEvent, ReplayCommunication } from "./types";
import { DolphinEventType, DolphinLaunchType } from "./types";

const log = electronLog.scope("dolphin/manager");

// DolphinManager should be in control of all dolphin instances that get opened for actual use.
// This includes playing netplay, viewing replays, watching broadcasts (spectating), and configuring Dolphin.
export class DolphinManager {
  private playbackDolphinInstances = new Map<string, PlaybackDolphinInstance>();
  private netplayDolphinInstance: DolphinInstance | null = null;
  private eventSubject = new Subject<DolphinEvent>();
  public events = Observable.from(this.eventSubject);

  constructor(private settingsManager: SettingsManager) {}

  public getInstallation(launchType: DolphinLaunchType): DolphinInstallation {
    const dolphinPath = this.settingsManager.getDolphinPath(launchType);
    return new DolphinInstallation(launchType, dolphinPath);
  }

  public async installDolphin(dolphinType: DolphinLaunchType): Promise<void> {
    const dolphinInstall = this.getInstallation(dolphinType);
    await dolphinInstall.validate({
      onProgress: (current, total) => this._onProgress(dolphinType, current, total),
      onComplete: () => this._onComplete(dolphinType),
    });
    const isoPath = this.settingsManager.get().settings.isoPath;
    if (isoPath) {
      await dolphinInstall.addGamePath(isoPath);
    }
  }

  public async launchPlaybackDolphin(id: string, replayComm: ReplayCommunication): Promise<void> {
    const playbackInstallation = this.getInstallation(DolphinLaunchType.PLAYBACK);
    const dolphinPath = await playbackInstallation.findDolphinExecutable();
    const meleeIsoPath = await this._getIsoPath();

    const configuring = this.playbackDolphinInstances.get("configure");
    if (configuring) {
      throw new Error("Cannot open dolphin if a configuring dolphin is open.");
    }
    let playbackInstance = this.playbackDolphinInstances.get(id);
    if (!playbackInstance) {
      playbackInstance = new PlaybackDolphinInstance(dolphinPath, meleeIsoPath);
      playbackInstance.on("close", (exitCode) => {
        this.eventSubject.next({
          type: DolphinEventType.CLOSED,
          instanceId: id,
          dolphinType: DolphinLaunchType.PLAYBACK,
          exitCode,
        });

        // Remove the instance from the map on close
        this.playbackDolphinInstances.delete(id);
      });
      playbackInstance.on("error", (err: Error) => {
        log.error(err);
        throw err;
      });

      this.playbackDolphinInstances.set(id, playbackInstance);
    }

    await playbackInstance.play(replayComm);
  }

  public async launchNetplayDolphin() {
    if (this.netplayDolphinInstance) {
      throw new Error("Netplay dolphin is already open!");
    }

    await this._updateDolphinSettings(DolphinLaunchType.NETPLAY);

    const netplayInstallation = this.getInstallation(DolphinLaunchType.NETPLAY);
    const dolphinPath = await netplayInstallation.findDolphinExecutable();
    log.info(`Launching dolphin at path: ${dolphinPath}`);
    const launchMeleeOnPlay = this.settingsManager.get().settings.launchMeleeOnPlay;
    const meleeIsoPath = launchMeleeOnPlay ? await this._getIsoPath() : undefined;

    // Create the Dolphin instance and start it
    this.netplayDolphinInstance = new DolphinInstance(dolphinPath, meleeIsoPath);
    this.netplayDolphinInstance.on("close", (exitCode) => {
      this.eventSubject.next({
        type: DolphinEventType.CLOSED,
        dolphinType: DolphinLaunchType.NETPLAY,
        exitCode,
      });

      this.netplayDolphinInstance = null;
      log.warn(`Dolphin exit code: ${exitCode}`);
    });
    this.netplayDolphinInstance.on("error", (err: Error) => {
      log.error(err);
      throw err;
    });
    this.netplayDolphinInstance.start();
  }

  public async configureDolphin(launchType: DolphinLaunchType) {
    log.debug(`configuring ${launchType} dolphin...`);

    await this._updateDolphinSettings(launchType);

    const installation = this.getInstallation(launchType);
    const dolphinPath = await installation.findDolphinExecutable();
    if (launchType === DolphinLaunchType.NETPLAY && !this.netplayDolphinInstance) {
      const instance = new DolphinInstance(dolphinPath);
      this.netplayDolphinInstance = instance;
      instance.on("close", (exitCode) => {
        this.eventSubject.next({
          type: DolphinEventType.CLOSED,
          dolphinType: DolphinLaunchType.NETPLAY,
          exitCode,
        });
        this.netplayDolphinInstance = null;
      });
      instance.on("error", (err: Error) => {
        log.error(err);
        throw err;
      });
      instance.start();
    } else if (launchType === DolphinLaunchType.PLAYBACK && this.playbackDolphinInstances.size === 0) {
      const instanceId = "configure";
      const instance = new PlaybackDolphinInstance(dolphinPath);
      this.playbackDolphinInstances.set(instanceId, instance);
      instance.on("close", (exitCode) => {
        this.eventSubject.next({
          type: DolphinEventType.CLOSED,
          dolphinType: DolphinLaunchType.PLAYBACK,
          instanceId,
          exitCode,
        });

        // Remove the instance from the map on close
        this.playbackDolphinInstances.delete(instanceId);
      });
      instance.on("error", (err: Error) => {
        log.error(err);
        throw err;
      });
      instance.start();
    }
  }

  public async reinstallDolphin(launchType: DolphinLaunchType) {
    switch (launchType) {
      case DolphinLaunchType.NETPLAY: {
        if (this.netplayDolphinInstance !== null) {
          log.warn("A netplay dolphin is open");
          return;
        }
        break;
      }
      case DolphinLaunchType.PLAYBACK: {
        if (this.playbackDolphinInstances.size > 0) {
          log.warn("A playback dolphin is open");
          return;
        }
        break;
      }
    }

    const installation = this.getInstallation(launchType);
    await installation.downloadAndInstall({
      cleanInstall: true,
      onProgress: (current, total) => this._onProgress(launchType, current, total),
    });

    const isoPath = this.settingsManager.get().settings.isoPath;
    if (isoPath) {
      await installation.addGamePath(isoPath);
    }

    this._onComplete(launchType);
  }

  public async setMod(id: number): Promise<void> {
    const modList = this.settingsManager.get().mods;
    const iniFilePaths = [
      this.getInstallation(DolphinLaunchType.PLAYBACK).getIniFilePath(),
      this.getInstallation(DolphinLaunchType.NETPLAY).getIniFilePath(),
    ];
    if (id < modList.length) {
      await this.settingsManager.selectMod(id);
      for (const iniFilePath of iniFilePaths) {
        const iniFile = await IniFile.init(iniFilePath);
        await addElfPath(iniFile, path.dirname(modList[id].elfPath));
        await addSdCardPath(iniFile, modList[id].sdCardPath);
      }
    }
  }

  public async installMod(mod: DefaultMods): Promise<void> {
    const modsDir = this.settingsManager.get().settings.defaultModsDir;
    const modInstallation = new ModInstallation(mod, modsDir);
    await modInstallation.validate({
      onProgress(_current, _total) {
        null;
      },
      onComplete() {
        null;
      },
    });
  }

  private async _getIsoPath(): Promise<string | undefined> {
    const meleeIsoPath = this.settingsManager.get().settings.isoPath ?? undefined;
    if (meleeIsoPath) {
      // Make sure the file actually exists
      if (!(await fileExists(meleeIsoPath))) {
        throw new Error(`Could not find ISO file: ${meleeIsoPath}`);
      }
    }
    return meleeIsoPath;
  }

  private async _updateDolphinSettings(launchType: DolphinLaunchType) {
    const installation = this.getInstallation(launchType);
    await installation.updateSettings({
      replayPath: this.settingsManager.getRootSlpPath(),
      useMonthlySubfolders: this.settingsManager.getUseMonthlySubfolders(),
    });
  }

  private _onProgress(dolphinType: DolphinLaunchType, current: number, total: number) {
    this.eventSubject.next({
      type: DolphinEventType.DOWNLOAD_PROGRESS,
      dolphinType,
      progress: { current, total },
    });
  }

  private _onComplete(dolphinType: DolphinLaunchType) {
    this.eventSubject.next({
      type: DolphinEventType.DOWNLOAD_COMPLETE,
      dolphinType,
    });
  }
}
