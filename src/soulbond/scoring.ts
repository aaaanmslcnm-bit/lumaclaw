import type { DailyScoreBreakdown, InteractionSummary, ScoreReason } from "./types.js";

const BASE_SCORE = 50;
const MIN_SCORE = 0;
const MAX_SCORE = 100;

function pushReason(reasons: ScoreReason[], key: string, label: string, delta: number) {
  if (!delta) {
    return;
  }
  reasons.push({ key, label, delta });
}

function clampScore(score: number) {
  return Math.max(MIN_SCORE, Math.min(MAX_SCORE, score));
}

function clampCount(value: number, max: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(max, Math.trunc(value)));
}

function clampSpecialEventBonus(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(20, Math.trunc(value)));
}

// This function now mirrors the MVP rules written in the SoulClaw planning docs.
// We keep the rules explicit here so a beginner can understand why each score changed.
export function calculateDailyScore(summary: InteractionSummary): DailyScoreBreakdown {
  const reasons: ScoreReason[] = [];

  const greetings = clampCount(summary.greetings, 1);
  const meaningfulChats = clampCount(summary.meaningfulChats, 2);
  const completedTasks = clampCount(summary.completedTasks, 2);
  const gratitudeMoments = clampCount(summary.gratitudeMoments, 2);
  const lifeShares = clampCount(summary.lifeShares, 1);
  const rudeEvents = clampCount(summary.rudeEvents, 1);
  const teasingEvents = clampCount(summary.teasingEvents, 1);
  const ignoredFollowUps = clampCount(summary.ignoredFollowUps, 1);
  const streakDays = clampCount(summary.streakDays, Number.MAX_SAFE_INTEGER);
  const specialEventBonus = clampSpecialEventBonus(summary.specialEventBonus);

  pushReason(reasons, "greeting", "Started the day with a greeting", greetings > 0 ? 10 : 0);
  pushReason(reasons, "meaningful-chat", "Had a meaningful interaction", meaningfulChats * 10);
  pushReason(reasons, "task-complete", "Asked for help and completed something", completedTasks * 15);
  pushReason(reasons, "gratitude", "Showed appreciation", gratitudeMoments * 8);
  pushReason(reasons, "life-share", "Shared daily life or mood", lifeShares * 10);
  pushReason(
    reasons,
    "streak",
    "Maintained an interaction streak",
    streakDays >= 7 ? 15 : streakDays >= 3 ? 8 : 0,
  );
  pushReason(reasons, "special-event", "Special event bonus", specialEventBonus);
  pushReason(reasons, "rude", "Negative interaction penalty", rudeEvents * -10);
  pushReason(reasons, "teasing", "Repeatedly toyed with the system in bad faith", teasingEvents * -8);
  pushReason(reasons, "ignored-follow-up", "Dropped a follow-up after asking for help", ignoredFollowUps * -5);

  const total = clampScore(BASE_SCORE + reasons.reduce((sum, reason) => sum + reason.delta, 0));

  return {
    baseScore: BASE_SCORE,
    totalScore: total,
    reasons,
  };
}
