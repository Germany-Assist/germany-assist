import { useCallback, useEffect, useState } from "react";
import { summarizePathProgress } from "./gamification.js";

const STORAGE_PREFIX = "ga:path:v1";
const PENDING_PATH_KEY = "ga:pending-path:v1";

export const progressKey = (pathId, userId) =>
  `${STORAGE_PREFIX}:${userId || "guest"}:${pathId}`;

export const createEmptyProgress = () => ({
  completed: {},
  startedAt: null,
  updatedAt: null,
});

const getStorage = () => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const readProgress = (pathId, userId) => {
  const storage = getStorage();
  if (!storage) return createEmptyProgress();
  try {
    const raw = storage.getItem(progressKey(pathId, userId));
    if (!raw) return createEmptyProgress();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return createEmptyProgress();
    return {
      completed:
        parsed.completed && typeof parsed.completed === "object"
          ? parsed.completed
          : {},
      startedAt: parsed.startedAt || null,
      updatedAt: parsed.updatedAt || null,
    };
  } catch {
    return createEmptyProgress();
  }
};

export const writeProgress = (pathId, userId, progress) => {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.setItem(progressKey(pathId, userId), JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
};

export const toggleStep = (progress, stepId, now = new Date()) => {
  const completed = { ...(progress?.completed || {}) };
  const timestamp = now instanceof Date ? now : new Date(now);
  const iso = timestamp.toISOString();

  if (completed[stepId]) {
    delete completed[stepId];
  } else {
    completed[stepId] = iso;
  }

  return {
    completed,
    startedAt: progress?.startedAt || iso,
    updatedAt: iso,
  };
};

export const resetProgress = () => createEmptyProgress();

/* ---------- signup hand-off ---------- */

export const writePendingPath = (selection) => {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.setItem(PENDING_PATH_KEY, JSON.stringify(selection));
    return true;
  } catch {
    return false;
  }
};

export const readPendingPath = () => {
  const storage = getStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(PENDING_PATH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.profession || !parsed?.country) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const clearPendingPath = () => {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(PENDING_PATH_KEY);
  } catch {
    // ignore storage failures
  }
};

/* ---------- hook ---------- */

export const usePathProgress = (path, userId) => {
  const [progress, setProgress] = useState(() =>
    readProgress(path.id, userId),
  );

  useEffect(() => {
    writeProgress(path.id, userId, progress);
  }, [path.id, userId, progress]);

  const toggle = useCallback(
    (stepId) => {
      setProgress((current) => toggleStep(current, stepId));
    },
    [],
  );

  const reset = useCallback(() => {
    setProgress(resetProgress());
  }, []);

  return {
    progress,
    summary: summarizePathProgress(path, progress),
    toggle,
    reset,
  };
};
