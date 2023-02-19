import type { BroadcastService } from "@broadcast/types";
import type { ConsoleService } from "@console/types";
import type { DolphinService } from "@dolphin/types";

import type { AuthService } from "./auth/types";
import type { BrawlbackBackendService } from "./brawlback/types";

export type Services = {
  authService: AuthService;
  brawlbackBackendService: BrawlbackBackendService;
  dolphinService: DolphinService;
  broadcastService: BroadcastService;
  consoleService: ConsoleService;
};
