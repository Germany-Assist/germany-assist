/**
 * Volatile facts used by the relocation paths.
 *
 * A claim is only rendered inside its effective window. Outside the window the
 * UI shows `fallback`, which points the customer to the official source instead
 * of printing a stale number.
 *
 * When you update a claim:
 * 1. Open the official source.
 * 2. Change `value`, `effectiveFrom`, `effectiveTo`, `verifiedOn`.
 * 3. Run `npm run eval:paths --prefix client`.
 */

export const CLAIMS = {
  blueCardSalary: {
    id: "blueCardSalary",
    label: "EU Blue Card salary threshold",
    value: "€50,700 gross per year",
    detail: "The general threshold for 2026.",
    effectiveFrom: "2026-01-01",
    effectiveTo: "2026-12-31",
    sourceId: "miigVisaTypes",
    verifiedOn: "2026-11-20",
    fallback: "the current general Blue Card salary threshold",
  },
  blueCardShortageSalary: {
    id: "blueCardShortageSalary",
    label: "Reduced EU Blue Card threshold",
    value: "€45,934.20 gross per year",
    detail:
      "For shortage occupations, recent graduates, and IT specialists in 2026.",
    effectiveFrom: "2026-01-01",
    effectiveTo: "2026-12-31",
    sourceId: "miigVisaTypes",
    verifiedOn: "2026-11-20",
    fallback: "the current reduced Blue Card salary threshold",
  },
  chancenkartePoints: {
    id: "chancenkartePoints",
    label: "Chancenkarte points required",
    value: "6 points",
    detail: "The minimum on the points route.",
    effectiveFrom: "2024-06-01",
    effectiveTo: null,
    sourceId: "miigChancenkarte",
    verifiedOn: "2026-11-20",
    fallback: "the current minimum points score",
  },
  chancenkarteDuration: {
    id: "chancenkarteDuration",
    label: "Chancenkarte job-search period",
    value: "up to 12 months",
    detail: "Check the duration printed on your card and visa.",
    effectiveFrom: "2024-06-01",
    effectiveTo: null,
    sourceId: "miigChancenkarte",
    verifiedOn: "2026-11-20",
    fallback: "the job-search period set by the German mission",
  },
  chancenkarteWork: {
    id: "chancenkarteWork",
    label: "Work allowed on the Chancenkarte",
    value: "part-time work and trial employment within the card's limits",
    detail:
      "Ask the German mission about the current hourly and trial-employment limits before you rely on this income.",
    effectiveFrom: "2024-06-01",
    effectiveTo: null,
    sourceId: "miigChancenkarte",
    verifiedOn: "2026-11-20",
    fallback: "the work rules printed on your Chancenkarte",
  },
};

const toDate = (date) => (date instanceof Date ? date : new Date(date));

/**
 * Returns the claim with `value` replaced by `fallback` when the current date is
 * outside its effective window. Callers should render `stale` as a prompt to
 * check the source, never as the old number.
 */
export const resolveClaim = (id, date = new Date()) => {
  const claim = CLAIMS[id];
  if (!claim) return null;

  const now = toDate(date).getTime();
  if (Number.isNaN(now)) return { ...claim, value: claim.fallback, stale: true };

  const from = claim.effectiveFrom ? Date.parse(claim.effectiveFrom) : null;
  const to = claim.effectiveTo ? Date.parse(claim.effectiveTo) : null;
  const before = from !== null && now < from;
  const after = to !== null && now > to;

  if (before || after) {
    return {
      ...claim,
      value: claim.fallback,
      stale: true,
      reason: before ? "not-yet-effective" : "expired",
    };
  }

  return { ...claim, stale: false };
};

export const resolveClaims = (ids = [], date = new Date()) => {
  const seen = new Set();
  const result = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    const claim = resolveClaim(id, date);
    if (!claim) continue;
    seen.add(id);
    result.push(claim);
  }
  return result;
};

export const CLAIM_IDS = Object.freeze(Object.keys(CLAIMS));
