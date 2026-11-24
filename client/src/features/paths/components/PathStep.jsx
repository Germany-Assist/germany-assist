import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ExternalLink, FileText, Star } from "lucide-react";
import { SOURCES } from "../data/sources.js";

const sourceLabel = (id) => SOURCES[id]?.label || "Official source";
const sourceHref = (id) =>
  SOURCES[id]?.url || "https://www.make-it-in-germany.com/de/";

export default function PathStep({ step, done, onToggle }) {
  const [open, setOpen] = useState(false);

  return (
    <li
      className={`rounded-xl border transition-colors ${
        done ? "border-sky-200 bg-sky-50/60" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-2 p-3 sm:p-4">
        <label className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center">
          <span className="sr-only">
            Mark {step.title} {done ? "not complete" : "complete"}
          </span>
          <input
            type="checkbox"
            checked={done}
            onChange={() => onToggle(step.id)}
            className="h-5 w-5 rounded border-slate-300 text-sky-700 accent-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
          />
        </label>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-start justify-between gap-3 rounded-lg py-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
        >
          <span className="min-w-0">
            <span
              className={`block text-sm font-semibold ${
                done ? "text-sky-900" : "text-slate-900"
              }`}
            >
              {step.title}
              {step.optional && (
                <span className="ml-2 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                  Optional
                </span>
              )}
            </span>
            <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1 font-semibold text-sky-800">
                <Star className="h-3 w-3" aria-hidden="true" />
                {step.xp} XP
              </span>
              {step.documents.length > 0 && (
                <span className="inline-flex items-center gap-1">
                  <FileText className="h-3 w-3" aria-hidden="true" />
                  {step.documents.length} document
                  {step.documents.length === 1 ? "" : "s"}
                </span>
              )}
              {done && <span className="font-medium text-emerald-700">Done</span>}
            </span>
          </span>
          <ChevronDown
            className={`mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200/70 px-4 pb-4 pt-3 sm:px-5">
          <p className="text-sm leading-relaxed text-slate-600">{step.body}</p>

          {step.documents.length > 0 && (
            <div className="mt-4">
              <h4 className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Documents to prepare
              </h4>
              <ul className="mt-2 space-y-1.5">
                {step.documents.map((document) => (
                  <li
                    key={document}
                    className="flex items-start gap-2 text-sm text-slate-700"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-700"
                      aria-hidden="true"
                    />
                    <span>{document}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {step.sourceIds.map((sourceId) => (
              <OfficialSourceLink key={sourceId} sourceId={sourceId} />
            ))}
            {step.serviceCategory && (
              <Link
                to={`/services?category=${step.serviceCategory}`}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
              >
                Find help with this step
              </Link>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

function OfficialSourceLink({ sourceId }) {
  return (
    <a
      href={sourceHref(sourceId)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg text-xs font-semibold text-sky-800 underline decoration-sky-300 underline-offset-2 hover:text-sky-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
    >
      {sourceLabel(sourceId)}
      <ExternalLink className="h-3 w-3" aria-hidden="true" />
    </a>
  );
}
