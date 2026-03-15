export type SoulBondCronSchedule = {
  kind: "cron";
  expr: string;
  tz?: string;
  staggerMs?: number;
};

export type SoulBondCronPayload = {
  kind: "systemEvent";
  text: string;
};

export type SoulBondCronJobState = {
  nextRunAtMs?: number;
  runningAtMs?: number;
  lastRunAtMs?: number;
  lastRunStatus?: "ok" | "error" | "skipped";
  lastStatus?: "ok" | "error" | "skipped";
  lastError?: string;
  lastDurationMs?: number;
  consecutiveErrors?: number;
  lastFailureAlertAtMs?: number;
  scheduleErrorCount?: number;
  lastDeliveryStatus?: "delivered" | "not-delivered" | "unknown" | "not-requested";
  lastDeliveryError?: string;
  lastDelivered?: boolean;
};

export type SoulBondCronJobCreate = {
  name: string;
  enabled: boolean;
  description?: string;
  schedule: SoulBondCronSchedule;
  sessionTarget: "main";
  wakeMode: "next-heartbeat";
  payload: SoulBondCronPayload;
  state?: Partial<SoulBondCronJobState>;
  delivery?: never;
  failureAlert?: never;
};
