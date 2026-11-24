import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import PathPicker from "./PathPicker.jsx";
import { buildPath, tryBuildPath, getPathHref } from "../pathEngine.js";

export default function PathSpotlight() {
  const [selection, setSelection] = useState({
    profession: "software-engineer",
    country: "IN",
    goal: "work",
  });

  const path = useMemo(() => {
    const { path: built } = tryBuildPath({
      professionId: selection.profession,
      countryCode: selection.country,
      goal: selection.goal,
    });
    return built || buildPath({ professionId: "general", countryCode: "ZZ" });
  }, [selection]);

  const handleChange = (field, value) => {
    setSelection((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="mb-12 rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-white p-6 md:p-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-end">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-sky-800">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            New: gamified paths
          </p>
          <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Your move is not generic. Your plan should not be either.
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Pick your profession and nationality. Get a step-by-step German
            relocation path with XP, badges, document checklists, and a link to
            the official source behind every step.
          </p>
        </div>

        <div className="min-w-0">
          <PathPicker
            idPrefix="spotlight"
            profession={selection.profession}
            country={selection.country}
            goal={selection.goal}
            onChange={handleChange}
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              {path.steps.length} steps · {path.totalXp} XP · saved on this
              device
            </p>
            <Link
              to={getPathHref(path)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-sky-700 bg-white px-5 text-sm font-semibold text-sky-800 transition-colors hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            >
              Preview my path
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-sky-100 pt-4">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Sample path
        </span>
        {path.steps.slice(0, 3).map((step) => (
          <span
            key={step.id}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
          >
            {step.title}
          </span>
        ))}
        <span className="text-xs text-slate-500">
          +{Math.max(path.steps.length - 3, 0)} more
        </span>
      </div>
    </div>
  );
}
