/**
 * Official sources used by the gamified relocation paths.
 *
 * Rules:
 * - Keep one entry per publisher/page.
 * - `verifiedOn` is the date a human last opened the page and checked it.
 * - `url` must be https and must point to the official publisher, not an
 *   aggregator or a law firm's summary.
 * - Volatile facts belong in claims.js, not here.
 */

export const SOURCES = {
  miigHome: {
    label: "Make it in Germany — Federal Government portal",
    publisher: "Federal Government of Germany",
    url: "https://www.make-it-in-germany.com/de/",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
  miigQuickCheck: {
    label: "Make it in Germany — Quick-Check",
    publisher: "Federal Government of Germany",
    url: "https://www.make-it-in-germany.com/de/visum-anerkennung/quick-check",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
  miigVisaTypes: {
    label: "Make it in Germany — Visa types overview",
    publisher: "Federal Government of Germany",
    url: "https://www.make-it-in-germany.com/de/visum-anerkennung/visaarten",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
  miigVisaApply: {
    label: "Make it in Germany — How to apply for a visa",
    publisher: "Federal Government of Germany",
    url: "https://www.make-it-in-germany.com/de/visum-anerkennung/visum-beantragen",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
  miigChancenkarte: {
    label: "Make it in Germany — Chancenkarte (Opportunity Card)",
    publisher: "Federal Government of Germany",
    url: "https://www.make-it-in-germany.com/de/visum-anerkennung/chancenkarte",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
  miigRecognition: {
    label: "Make it in Germany — Recognition of qualifications",
    publisher: "Federal Government of Germany",
    url: "https://www.make-it-in-germany.com/de/visum-anerkennung/anerkennung",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
  miigFirstSteps: {
    label: "Make it in Germany — First steps in Germany",
    publisher: "Federal Government of Germany",
    url: "https://www.make-it-in-germany.com/de/ankommen-bleiben/erste-schritte",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
  miigJobSearch: {
    label: "Make it in Germany — Job search and application",
    publisher: "Federal Government of Germany",
    url: "https://www.make-it-in-germany.com/de/arbeiten-in-deutschland/jobsuche-bewerbung",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
  miigJobBoard: {
    label: "Make it in Germany — Job board",
    publisher: "Federal Government of Germany",
    url: "https://www.make-it-in-germany.com/de/arbeiten-in-deutschland/jobboerse",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
  miigStudy: {
    label: "Make it in Germany — Studying in Germany",
    publisher: "Federal Government of Germany",
    url: "https://www.make-it-in-germany.com/de/studium-ausbildung/studieren-in-deutschland",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
  miigAusbildung: {
    label: "Make it in Germany — Vocational training in Germany",
    publisher: "Federal Government of Germany",
    url: "https://www.make-it-in-germany.com/de/studium-ausbildung/ausbildung-in-deutschland",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
  anerkennungPortal: {
    label: "Recognition in Germany — official recognition portal",
    publisher: "Federal Government of Germany",
    url: "https://www.anerkennung-in-deutschland.de/html/de/",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
  zab: {
    label: "ZAB — Statement of Comparability for foreign qualifications",
    publisher: "Kultusministerkonferenz (KMK)",
    url: "https://www.kmk.org/zab",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
  bamf: {
    label: "BAMF — Federal Office for Migration and Refugees",
    publisher: "Bundesamt für Migration und Flüchtlinge",
    url: "https://www.bamf.de/",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
  auswaertigesAmt: {
    label: "Federal Foreign Office — German missions abroad",
    publisher: "Auswärtiges Amt",
    url: "https://www.auswaertiges-amt.de/de",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
  hcchApostille: {
    label: "HCCH — Apostille Convention status table",
    publisher: "Hague Conference on Private International Law",
    url: "https://www.hcch.net/en/instruments/conventions/status-table/?cid=41",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
  apsIndia: {
    label: "APS India — Akademische Prüfstelle New Delhi",
    publisher: "German Embassy New Delhi",
    url: "https://www.aps-india.de/",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
  apsChina: {
    label: "APS China — Akademische Prüfstelle Beijing",
    publisher: "German Embassy Beijing",
    url: "https://www.aps.org.cn/",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
  apsVietnam: {
    label: "APS Vietnam — German Embassy Hanoi",
    publisher: "German Embassy Hanoi",
    url: "https://vietnam.diplo.de/",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
  arbeitsagentur: {
    label: "Bundesagentur für Arbeit — Job search",
    publisher: "Bundesagentur für Arbeit",
    url: "https://www.arbeitsagentur.de/",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
  daad: {
    label: "DAAD — Study and research in Germany",
    publisher: "Deutscher Akademischer Austauschdienst",
    url: "https://www.daad.de/de/",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
  hochschulkompass: {
    label: "Hochschulkompass — German university programmes",
    publisher: "Hochschulrektorenkonferenz",
    url: "https://www.hochschulkompass.de/",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
  bmg: {
    label: "Federal Ministry of Health",
    publisher: "Bundesministerium für Gesundheit",
    url: "https://www.bundesgesundheitsministerium.de/",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
  bzst: {
    label: "Federal Central Tax Office — tax identification number",
    publisher: "Bundeszentralamt für Steuern",
    url: "https://www.bzst.de/",
    kind: "official",
    verifiedOn: "2026-11-20",
  },
};

export const getSource = (id) => SOURCES[id] || null;

export const resolveSources = (ids = []) => {
  const seen = new Set();
  const result = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    const source = SOURCES[id];
    if (!source) continue;
    seen.add(id);
    result.push({ id, ...source });
  }
  return result;
};

export const SOURCE_IDS = Object.freeze(Object.keys(SOURCES));
