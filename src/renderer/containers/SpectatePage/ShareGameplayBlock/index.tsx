import { Ports } from "@common/brawlback-js/types";
import React from "react";

import { InfoBlock } from "@/components/InfoBlock";
import { useAccount } from "@/lib/hooks/useAccount";
import { useBroadcast } from "@/lib/hooks/useBroadcast";
import { useConsole } from "@/lib/hooks/useConsole";
import { useToasts } from "@/lib/hooks/useToasts";

import { BroadcastPanel } from "./BroadcastPanel";

const log = window.electron.log;

// These are the default params for broadcasting Netplay Dolphin
const ip = "127.0.0.1";
const port = Ports.DEFAULT;

export const ShareGameplayBlock: React.FC<{ className?: string }> = ({ className }) => {
  const playKey = useAccount((store) => store.playKey);
  const startTime = useConsole((store) => store.startTime);
  const endTime = useConsole((store) => store.endTime);
  const brawlbackStatus = useConsole((store) => store.brawlbackConnectionStatus);
  const dolphinStatus = useConsole((store) => store.dolphinConnectionStatus);
  const [start, stop] = useBroadcast();
  const { showError } = useToasts();

  return (
    <InfoBlock title="Share your gameplay" className={className}>
      <BroadcastPanel
        brawlbackServerStatus={brawlbackStatus}
        dolphinStatus={dolphinStatus}
        startTime={startTime}
        endTime={endTime}
        onDisconnect={stop}
        onStartBroadcast={async (viewerId: string) => {
          try {
            await start({
              ip,
              port,
              viewerId,
              name: playKey ? playKey.connectCode : undefined,
            });
          } catch (err) {
            log.error(err);
            showError("Error connecting to Dolphin. Ensure Dolphin is running and try again.");
          }
        }}
      />
    </InfoBlock>
  );
};
