export const SOUL_BOND_STAGES = [
  "stranger",
  "familiar",
  "close",
  "trusted",
  "resonant",
] as const;

export type SoulBondStage = (typeof SOUL_BOND_STAGES)[number];

export const SOUL_BOND_SETTINGS_MODES = ["simple", "100-day"] as const;
export const SOUL_BOND_STATE_VERSION = 1;

export type SoulBondTone = "reserved" | "natural" | "warm";

export interface SoulBondSettings {
  enabled: boolean;
  mode: (typeof SOUL_BOND_SETTINGS_MODES)[number];
  allowNegative: boolean;
  notifyDaily: boolean;
  affectTone: boolean;
  affectAvatar: boolean;
  affectVoice: boolean;
}

// These are the small, countable signals we can collect from one day of interaction.
// The first version keeps them simple on purpose so the scoring rules stay easy to read.
export interface InteractionSummary {
  date: string;
  greetings: number;
  meaningfulChats: number;
  completedTasks: number;
  gratitudeMoments: number;
  lifeShares: number;
  rudeEvents: number;
  teasingEvents: number;
  ignoredFollowUps: number;
  streakDays: number;
  specialEventBonus: number;
}

export interface ScoreReason {
  key: string;
  label: string;
  delta: number;
}

export interface DailyScoreBreakdown {
  baseScore: number;
  totalScore: number;
  reasons: ScoreReason[];
}

export interface SoulBondRecord {
  date: string;
  dailyScore: number;
  bondDelta: number;
  stage: SoulBondStage;
  reasons: ScoreReason[];
}

export interface SoulBondState {
  version: number;
  currentDay: number;
  bond: number;
  stage: SoulBondStage;
  lastEvaluationAt?: string;
  dailyHistory: SoulBondRecord[];
  settings: SoulBondSettings;
}

export interface DailyEvaluationResult {
  record: SoulBondRecord;
  nextState: SoulBondState;
}

export function createDefaultInteractionSummary(date: string): InteractionSummary {
  return {
    date,
    greetings: 0,
    meaningfulChats: 0,
    completedTasks: 0,
    gratitudeMoments: 0,
    lifeShares: 0,
    rudeEvents: 0,
    teasingEvents: 0,
    ignoredFollowUps: 0,
    streakDays: 0,
    specialEventBonus: 0,
  };
}

export function createDefaultSoulBondState(): SoulBondState {
  return {
    version: SOUL_BOND_STATE_VERSION,
    currentDay: 0,
    bond: 0,
    stage: "stranger",
    dailyHistory: [],
    settings: {
      enabled: true,
      mode: "100-day",
      allowNegative: false,
      notifyDaily: true,
      affectTone: true,
      affectAvatar: true,
      affectVoice: false,
    },
  };
}

export function resolveSoulBondStage(bond: number): SoulBondStage {
  if (bond >= 80) {
    return "resonant";
  }
  if (bond >= 50) {
    return "trusted";
  }
  if (bond >= 25) {
    return "close";
  }
  if (bond >= 10) {
    return "familiar";
  }
  return "stranger";
}
