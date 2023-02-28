import type { EventEmitter } from "events";

// these taken directly from https://github.com/project-slippi/slippi-js/blob/master/src/console/types.ts
export enum ConnectionStatus {
  DISCONNECTED = 0,
  CONNECTING = 1,
  CONNECTED = 2,
  RECONNECT_WAIT = 3,
}

export enum ConnectionEvent {
  CONNECT = "connect",
  MESSAGE = "message",
  HANDSHAKE = "handshake",
  STATUS_CHANGE = "statusChange",
  DATA = "data",
  ERROR = "error",
}

export enum Ports {
  DEFAULT = 51441,
  LEGACY = 666,
  RELAY_START = 53741,
}

export interface ConnectionSettings {
  ipAddress: string;
  port: number;
}

export interface Connection extends EventEmitter {
  getStatus(): ConnectionStatus;
  getSettings(): ConnectionSettings;
  getDetails(): ConnectionDetails;
  connect(ip: string, port: number): void;
  disconnect(): void;
}

export interface ConnectionDetails {
  consoleNick: string;
  gameDataCursor: number | Uint8Array;
  version: string;
  clientToken?: number;
}

// from https://github.com/project-slippi/slippi-js/blob/cd8177915f3d286d1456e8cf1b15b98c0807be31/src/types.ts
export interface PlayerType {
  playerIndex: number;
  port: number;
  characterId: number | null;
  type: number | null;
  startStocks: number | null;
  characterColor: number | null;
  teamShade: number | null;
  handicap: number | null;
  teamId: number | null;
  staminaMode: boolean | null;
  silentCharacter: boolean | null;
  invisible: boolean | null;
  lowGravity: boolean | null;
  blackStockIcon: boolean | null;
  metal: boolean | null;
  startOnAngelPlatform: boolean | null;
  rumbleEnabled: boolean | null;
  cpuLevel: number | null;
  offenseRatio: number | null;
  defenseRatio: number | null;
  modelScale: number | null;
  controllerFix: string | null;
  nametag: string | null;
  displayName: string;
  connectCode: string;
  userId: string;
}

export enum TimerType {
  NONE = 0b00,
  DECREASING = 0b10,
  INCREASING = 0b11,
}

export enum ItemSpawnType {
  OFF = 0xff,
  VERY_LOW = 0x00,
  LOW = 0x01,
  MEDIUM = 0x02,
  HIGH = 0x03,
  VERY_HIGH = 0x04,
}

export interface GameStartType {
  slpVersion: string | null;
  timerType: TimerType | null;
  inGameMode: number | null;
  friendlyFireEnabled: boolean | null;
  isTeams: boolean | null;
  stageId: number | null;
  startingTimerSeconds: number | null;
  itemSpawnBehavior: ItemSpawnType | null;
  enabledItems: number | null;
  players: PlayerType[];
  scene: number | null;
  gameMode: GameMode | null;
  language: Language | null;
  gameInfoBlock: GameInfoType | null;
  randomSeed: number | null;
  isPAL: boolean | null;
  isFrozenPS: boolean | null;
  matchInfo: MatchInfo | null;
}

export enum GameMode {
  VS = 0x02,
  ONLINE = 0x08,
  TARGET_TEST = 0x0f,
  HOME_RUN_CONTEST = 0x20,
}

export enum Language {
  JAPANESE = 0,
  ENGLISH = 1,
}

export interface GameInfoType {
  gameBitfield1: number | null;
  gameBitfield2: number | null;
  gameBitfield3: number | null;
  gameBitfield4: number | null;
  bombRainEnabled: boolean | null;
  selfDestructScoreValue: number | null;
  itemSpawnBitfield1: number | null;
  itemSpawnBitfield2: number | null;
  itemSpawnBitfield3: number | null;
  itemSpawnBitfield4: number | null;
  itemSpawnBitfield5: number | null;
  damageRatio: number | null;
}

interface MatchInfo {
  matchId: string | null;
  gameNumber: number | null;
  tiebreakerNumber: number | null;
}

export interface MetadataType {
  startAt?: string | null;
  playedOn?: string | null;
  lastFrame?: number | null;
  players?: {
    [playerIndex: number]: {
      characters: {
        [internalCharacterId: number]: number;
      };
      names?: {
        netplay?: string | null;
        code?: string | null;
      };
    };
  } | null;
  consoleNick?: string | null;
}
