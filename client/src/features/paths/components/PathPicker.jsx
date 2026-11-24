import { useMemo } from "react";
import countryList from "react-select-country-list";
import { PROFESSIONS } from "../data/professions.js";
import { GOALS } from "../data/goals.js";

const selectClass =
  "w-full min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

const labelClass =
  "block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1.5";

export default function PathPicker({
  profession,
  country,
  goal,
  onChange,
  idPrefix = "path",
  showGoal = true,
  className = "",
}) {
  const countries = useMemo(
    () =>
      countryList()
        .getData()
        .slice()
        .sort((a, b) => a.label.localeCompare(b.label)),
    [],
  );

  return (
    <div
      className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${
        showGoal ? "lg:grid-cols-3" : ""
      } ${className}`}
    >
      <div>
        <label htmlFor={`${idPrefix}-profession`} className={labelClass}>
          Your profession
        </label>
        <select
          id={`${idPrefix}-profession`}
          className={selectClass}
          value={profession}
          onChange={(event) => onChange("profession", event.target.value)}
        >
          {PROFESSIONS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-country`} className={labelClass}>
          Your nationality
        </label>
        <select
          id={`${idPrefix}-country`}
          className={selectClass}
          value={country}
          onChange={(event) => onChange("country", event.target.value)}
        >
          {countries.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {showGoal && (
        <div>
          <label htmlFor={`${idPrefix}-goal`} className={labelClass}>
            Your goal
          </label>
          <select
            id={`${idPrefix}-goal`}
            className={selectClass}
            value={goal}
            onChange={(event) => onChange("goal", event.target.value)}
          >
            {GOALS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.shortLabel} — {item.description}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
