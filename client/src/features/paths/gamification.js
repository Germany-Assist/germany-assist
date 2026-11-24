const LEVEL_RATIOS = [
  { key: "newcomer", label: "Newcomer", ratio: 0 },
  { key: "explorer", label: "Explorer", ratio: 0.2 },
  { key: "navigator", label: "Navigator", ratio: 0.45 },
  { key: "settler", label: "Settler", ratio: 0.7 },
  { key: "local", label: "Local", ratio: 1 },
];

export const BADGES = [
  {
    id: "first-move",
    label: "First move",
    description: "Complete your first step.",
    iconKey: "footprints",
  },
  {
    id: "documents-ready",
    label: "Documents ready",
    description: "Complete every step that needs documents.",
    iconKey: "folder-check",
  },
  {
    id: "application-in",
    label: "Application in",
    description: "Complete the visa application step.",
    iconKey: "send",
  },
  {
    id: "landed",
    label: "Landed",
    description: "Prepare for arrival and complete your Anmeldung.",
    iconKey: "plane-landing",
  },
  {
    id: "settled",
    label: "Settled",
    description: "Complete every step on the path.",
    iconKey: "home",
  },
];

const toDayKey = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getCompletedStepIds = (progress) =>
  Object.keys(progress?.completed || {});

export const computeXp = (path, progress) => {
  const completed = new Set(getCompletedStepIds(progress));
  return path.steps.reduce(
    (sum, step) => (completed.has(step.id) ? sum + step.xp : sum),
    0,
  );
};

export const computeLevel = (xp, totalXp) => {
  const total = Math.max(totalXp, 1);
  const ratio = Math.min(xp / total, 1);

  let index = 0;
  for (let i = 0; i < LEVEL_RATIOS.length; i += 1) {
    if (ratio >= LEVEL_RATIOS[i].ratio) index = i;
  }

  const current = LEVEL_RATIOS[index];
  const next = LEVEL_RATIOS[index + 1] || null;
  const minXp = Math.ceil(total * current.ratio);
  const nextXp = next ? Math.ceil(total * next.ratio) : total;

  return {
    ...current,
    index,
    minXp,
    nextLevel: next ? { ...next, minXp: nextXp } : null,
    xpToNext: next ? Math.max(nextXp - xp, 0) : 0,
  };
};

export const computeBadges = (path, progress) => {
  const completed = new Set(getCompletedStepIds(progress));
  const allSteps = path.steps;
  const documentSteps = allSteps.filter((step) =>
    step.tags.includes("documents"),
  );
  const isDone = (id) => completed.has(id);

  return BADGES.map((badge) => {
    let earned = false;
    if (badge.id === "first-move") earned = completed.size > 0;
    if (badge.id === "documents-ready") {
      earned =
        documentSteps.length > 0 && documentSteps.every((step) => isDone(step.id));
    }
    if (badge.id === "application-in") earned = isDone("apply-visa");
    if (badge.id === "landed") {
      earned = isDone("arrival-prep") && isDone("anmeldung");
    }
    if (badge.id === "settled") {
      earned = allSteps.every((step) => isDone(step.id));
    }
    return { ...badge, earned };
  });
};

/**
 * Counts consecutive local calendar days with at least one completion, ending
 * today (or yesterday, so a streak is not lost before the day is over).
 */
export const computeStreak = (progress, now = new Date()) => {
  const days = new Set(
    Object.values(progress?.completed || {})
      .map((value) => toDayKey(value))
      .filter(Boolean),
  );
  if (days.size === 0) return 0;

  const today = new Date(now);
  today.setHours(12, 0, 0, 0);
  const todayKey = toDayKey(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = toDayKey(yesterday);

  let cursor = new Date(today);
  if (!days.has(todayKey)) {
    if (!days.has(yesterdayKey)) return 0;
    cursor = yesterday;
  }

  let streak = 0;
  while (days.has(toDayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

export const summarizePathProgress = (path, progress, now = new Date()) => {
  const completed = getCompletedStepIds(progress);
  const completedSteps = path.steps.filter((step) => completed.includes(step.id));
  const xp = computeXp(path, progress);
  const level = computeLevel(xp, path.totalXp);
  const badges = computeBadges(path, progress);
  const percent =
    path.totalXp > 0 ? Math.round((xp / path.totalXp) * 100) : 0;

  return {
    xp,
    level,
    badges,
    earnedBadges: badges.filter((badge) => badge.earned),
    streak: computeStreak(progress, now),
    completedIds: completed,
    completedCount: completedSteps.length,
    totalSteps: path.steps.length,
    percent,
    isComplete: completedSteps.length === path.steps.length,
  };
};

export const LEVEL_KEYS = LEVEL_RATIOS.map((level) => level.key);
