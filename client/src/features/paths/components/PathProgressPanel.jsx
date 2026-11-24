import { useState } from "react";
import { Flame, RotateCcw, Trophy } from "lucide-react";
import { getBadgeIcon } from "./icons.js";

export default function PathProgressPanel({ path, summary, onReset }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
      aria-labelledby="path-progress-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Your progress
          </p>
          <h2
            id="path-progress-title"
            className="mt-1 text-2xl font-bold tracking-tight text-slate-900"
          >
            {summary.level.label}
            <span className="ml-3 align-middle text-sm font-medium text-slate-500">
              {summary.xp} / {path.totalXp} XP
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
            <Flame className="h-3.5 w-3.5" aria-hidden="true" />
            {summary.streak > 0
              ? `${summary.streak}-day streak`
              : "Start a streak"}
          </span>
          {confirming ? (
            <span className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onReset();
                  setConfirming(false);
                }}
                className="min-h-11 rounded-xl bg-red-600 px-3 text-xs font-semibold text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Reset progress
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="min-h-11 rounded-xl border border-slate-300 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
              >
                Keep it
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="mt-5">
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={summary.percent}
          aria-label={`Path progress: ${summary.percent}% complete`}
        >
          <div
            className="h-full rounded-full bg-sky-700 transition-all duration-500 ease-elegant"
            style={{ width: `${summary.percent}%` }}
          />
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            {summary.completedCount} of {summary.totalSteps} steps complete
          </span>
          <span>
            {summary.level.nextLevel
              ? `${summary.level.xpToNext} XP to ${summary.level.nextLevel.label}`
              : "Top level reached"}
          </span>
        </div>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-sky-700" aria-hidden="true" />
          <h3 className="text-sm font-bold text-slate-900">Badges</h3>
        </div>
        <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {summary.badges.map((badge) => {
            const Icon = getBadgeIcon(badge.iconKey);
            return (
              <li
                key={badge.id}
                className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 ${
                  badge.earned
                    ? "border-sky-200 bg-sky-50"
                    : "border-slate-200 bg-white opacity-60"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    badge.earned
                      ? "bg-sky-700 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </span>
                <span>
                  <span className="block text-xs font-bold text-slate-900">
                    {badge.label}
                  </span>
                  <span className="block text-[11px] leading-snug text-slate-500">
                    {badge.description}
                  </span>
                </span>
                <span className="sr-only">
                  {badge.earned ? "Earned" : "Not earned yet"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
