/**
 * Country rules for document authentication and APS.
 *
 * - `aps` is set only for countries with an Akademische Prüfstelle.
 * - `authentication` is deliberately `check` when we are not certain. Do not
 *   guess; the HCCH status table is the authority.
 * - All other countries fall back to the generic `check` rule.
 */

const APOSTILLE = "apostille";
const LEGALISATION = "legalisation";
const CHECK = "check";

export const COUNTRIES = {
  IN: {
    label: "India",
    authentication: "aps",
    aps: {
      sourceId: "apsIndia",
      note: "Applicants from India normally need an APS certificate for study and for many visa routes. The APS verifies your academic documents and must be requested before the German mission processes the application.",
    },
  },
  CN: {
    label: "China",
    authentication: "aps",
    aps: {
      sourceId: "apsChina",
      note: "Applicants from China normally need an APS certificate. The APS checks your academic documents and issues the certificate used by German universities and missions.",
    },
  },
  VN: {
    label: "Vietnam",
    authentication: "aps",
    aps: {
      sourceId: "apsVietnam",
      note: "Applicants from Vietnam normally need an APS certificate from the German Embassy in Hanoi. Book the document check early; interview slots are limited.",
    },
  },
  PH: {
    label: "Philippines",
    authentication: APOSTILLE,
    note: "Public documents can usually be apostilled by the Department of Foreign Affairs. Confirm the exact document list with your employer, university, or recognition authority.",
  },
  TR: {
    label: "Turkey",
    authentication: APOSTILLE,
    note: "Turkish public documents can usually be apostilled. Some private documents still need notarisation before the apostille.",
  },
  BR: {
    label: "Brazil",
    authentication: APOSTILLE,
    note: "Brazilian public documents can usually be apostilled through the competent cartório. Check whether your document needs a certified German translation as well.",
  },
  NG: {
    label: "Nigeria",
    authentication: LEGALISATION,
    note: "Check with the German mission whether your documents need consular legalisation rather than an apostille. Nigerian documents often also need certified German translations.",
  },
  PK: {
    label: "Pakistan",
    authentication: LEGALISATION,
    note: "Check the German mission's document list. Pakistani documents may need attestation and consular legalisation, followed by certified German translations.",
  },
  EG: {
    label: "Egypt",
    authentication: CHECK,
    note: "Check the HCCH status table and the German mission's document list before paying for legalisation. Requirements can change.",
  },
};

const DEFAULT_COUNTRY = {
  authentication: CHECK,
  note: "Check the HCCH status table to see whether your country issues apostilles, or whether the German mission needs consular legalisation. Requirements depend on the document and the authority asking for it.",
};

export const normalizeCountryCode = (code) => {
  const value = String(code || "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(value) ? value : "ZZ";
};

export const getCountry = (code) => {
  const normalized = normalizeCountryCode(code);
  const known = COUNTRIES[normalized];
  if (known) return { code: normalized, ...known };
  return { code: normalized, ...DEFAULT_COUNTRY };
};

export const getCountryLabel = (code) => {
  const normalized = normalizeCountryCode(code);
  const known = COUNTRIES[normalized]?.label;
  if (known) return known;
  try {
    return (
      new Intl.DisplayNames(["en"], { type: "region" }).of(normalized) ||
      normalized
    );
  } catch {
    return normalized;
  }
};

export const COUNTRY_CODES = Object.freeze(Object.keys(COUNTRIES));
