import { ConnectionStatus } from "@slippi/slippi-js";
import create from "zustand";

type StoreState = {
  isBroadcasting: boolean;
  startTime: Date | null;
  endTime: Date | null;
  brawlbackConnectionStatus: ConnectionStatus;
  dolphinConnectionStatus: ConnectionStatus;
  broadcastError: string | null;
};

type StoreReducers = {
  setIsBroadcasting: (isBroadcasting: boolean) => void;
  setBrawlbackConnectionStatus: (connectionStatus: number) => void;
  setDolphinConnectionStatus: (connectionStatus: number) => void;
  setBroadcastError: (error: string | null) => void;
};

const initialState: StoreState = {
  isBroadcasting: false,
  startTime: null,
  endTime: null,
  brawlbackConnectionStatus: ConnectionStatus.DISCONNECTED,
  dolphinConnectionStatus: ConnectionStatus.DISCONNECTED,
  broadcastError: null,
};

export const useConsole = create<StoreState & StoreReducers>((set, get) => ({
  // Set the initial state
  ...initialState,

  // Reducers
  setIsBroadcasting: (isBroadcasting) => {
    const state = get();
    const wasBroadcasting = state.isBroadcasting;
    if (wasBroadcasting && !isBroadcasting) {
      // We stopped broadcasting so update the end time
      set({
        endTime: new Date(),
      });
    } else if (isBroadcasting && !wasBroadcasting) {
      // We started broadcasting so update the start time
      set({
        startTime: new Date(),
        endTime: null,
      });
    }
    set({
      isBroadcasting,
    });
  },
  setBrawlbackConnectionStatus: (connectionStatus) => {
    const { dolphinConnectionStatus, setIsBroadcasting } = get();
    const dolphinConnected = dolphinConnectionStatus === ConnectionStatus.CONNECTED;
    const isBroadcasting = dolphinConnected && connectionStatus !== ConnectionStatus.DISCONNECTED;
    set({
      brawlbackConnectionStatus: connectionStatus,
    });
    setIsBroadcasting(isBroadcasting);
  },

  setDolphinConnectionStatus: (connectionStatus) => {
    const { brawlbackConnectionStatus, setIsBroadcasting } = get();
    const brawlbackConnected = brawlbackConnectionStatus === ConnectionStatus.CONNECTED;
    const isBroadcasting = brawlbackConnected && connectionStatus !== ConnectionStatus.DISCONNECTED;
    set({
      dolphinConnectionStatus: connectionStatus,
    });
    setIsBroadcasting(isBroadcasting);
  },

  setBroadcastError: (error) => {
    set({
      broadcastError: error,
    });
  },
}));
