import { getCountry, getCountryLabel } from "./data/countries.js";
import { getGoal } from "./data/goals.js";
import { getProfession, PROFESSIONS } from "./data/professions.js";
import { resolveClaims } from "./data/claims.js";
import { resolveSources, SOURCES } from "./data/sources.js";

export const PHASES = [
  { id: "prepare", label: "Before you apply" },
  { id: "apply", label: "Apply" },
  { id: "arrive", label: "Arrive" },
  { id: "settle", label: "Settle in" },
];

export const PHASE_IDS = PHASES.map((phase) => phase.id);

export const PATH_DISCLAIMER =
  "This path is a planning aid, not legal advice. The competent authority, university, employer, or German mission makes the final decision. Check the official source for every step before you pay for anything.";

const BANNED_COPY = [
  /guarantee/i,
  /guaranteed/i,
  /instant approval/i,
  /100\s?%/,
  /€\s?\d/,
];

const normalizeStep = (step) => {
  for (const sourceId of step.sourceIds || []) {
    if (!SOURCES[sourceId]) {
      throw new Error(`Unknown source "${sourceId}" on step "${step.id}"`);
    }
  }
  return {
    order: step.order,
    phase: step.phase,
    id: step.id,
    title: step.title,
    body: step.body,
    documents: step.documents || [],
    sourceIds: step.sourceIds || [],
    claimIds: step.claimIds || [],
    xp: step.xp,
    optional: Boolean(step.optional),
    tags: step.tags || [],
    serviceCategory: step.serviceCategory || "",
  };
};

const originDocumentsStep = (country, countryLabel) => {
  if (country.aps) {
    return {
      id: "aps-certificate",
      phase: "prepare",
      title: "Request your APS certificate",
      body: `${country.aps.note} The APS checks your academic documents before a German mission or university will process them. Start early — the process includes document checks and, in some cases, an interview.`,
      documents: [
        "Academic transcripts and certificates",
        "Passport copy",
        "APS application form and fee receipt",
      ],
      sourceIds: [country.aps.sourceId, "miigVisaTypes"],
      xp: 60,
      tags: ["documents", "country"],
      serviceCategory: "visa-paperwork",
    };
  }

  if (country.authentication === "apostille") {
    return {
      id: "apostille-documents",
      phase: "prepare",
      title: "Apostille your official documents",
      body: `Documents issued in ${countryLabel} can usually be apostilled. ${country.note} Ask every receiving authority which documents it needs, and whether it also needs a certified German translation. An apostille confirms the signature, not the content of the document.`,
      documents: [
        "Birth certificate (if required)",
        "Degree certificates and transcripts",
        "Police or other certificates requested by the authority",
        "Certified German translations where required",
      ],
      sourceIds: ["hcchApostille", "miigVisaTypes"],
      xp: 50,
      tags: ["documents", "country"],
      serviceCategory: "translation",
    };
  }

  if (country.authentication === "legalisation") {
    return {
      id: "legalise-documents",
      phase: "prepare",
      title: "Legalise your documents at the German mission",
      body: `${country.note} Consular legalisation is different from an apostille: the German mission confirms the document chain. Book the appointment and ask for the exact document list before you pay for translations.`,
      documents: [
        "Original documents and copies",
        "Certified German translations",
        "German mission appointment confirmation",
      ],
      sourceIds: ["hcchApostille", "auswaertigesAmt"],
      xp: 60,
      tags: ["documents", "country"],
      serviceCategory: "translation",
    };
  }

  return {
    id: "check-document-authentication",
    phase: "prepare",
    title: "Check how to authenticate your documents",
    body: `${country.note} Start with the HCCH status table and the German mission responsible for your country of residence. Do not pay for legalisation until the receiving authority confirms what it needs.`,
    documents: [
      "List of documents requested by the authority",
      "Passport copy",
      "German mission checklist",
    ],
    sourceIds: ["hcchApostille", "auswaertigesAmt"],
    xp: 40,
    tags: ["documents", "country"],
    serviceCategory: "visa-paperwork",
  };
};

const recognitionStep = (profession, goalId) => {
  if (goalId === "study") {
    return {
      id: "recognition",
      phase: "prepare",
      title: "Check your certificates for university admission",
      body: "German universities and uni-assist check your school-leaving certificate and previous degree. A ZAB evaluation may be required for a foreign degree, and some programmes ask for a subject-specific assessment. Confirm the document list with each university before you apply.",
      documents: [
        "School-leaving certificate",
        "Degree certificate and transcripts",
        "ZAB evaluation if requested",
        "Certified translations where required",
      ],
      sourceIds: ["zab", "miigStudy", "anerkennungPortal"],
      xp: 40,
      optional: true,
      tags: ["documents", "recognition"],
      serviceCategory: "visa-paperwork",
    };
  }

  const required = profession.recognition === "required";
  const recommended = profession.recognition === "recommended";

  return {
    id: "recognition",
    phase: "prepare",
    title:
      profession.recognitionTitle ||
      (required
        ? "Get your qualification recognised"
        : recommended
          ? "Get a Statement of Comparability (recommended)"
          : "Check whether your qualification needs recognition"),
    body: profession.recognitionBody,
    documents: profession.keyDocuments || [],
    sourceIds: ["anerkennungPortal", "miigRecognition", "zab"],
    xp: required ? 90 : recommended ? 50 : 30,
    optional: !required,
    tags: ["documents", "recognition"],
    serviceCategory: "visa-paperwork",
  };
};

const languageStep = (profession) => ({
  id: "language-exam",
  phase: "prepare",
  title: "Book the language exam your route requires",
  body: `${profession.languageNote} Requirements depend on your profession, employer, recognition authority, and visa route. Confirm the exact level in writing before you book a course or exam. Accepted certificates include Goethe, telc, TestDaF, and ÖSD, depending on who is asking.`,
  documents: [
    "Registration confirmation or exam result",
    "The authority's written language requirement",
  ],
  sourceIds: ["miigRecognition", "miigVisaTypes"],
  xp: 50,
  tags: ["language"],
  serviceCategory: "language-learning",
});

const workSteps = (profession) => [
  {
    id: "job-offer",
    phase: "apply",
    title: "Secure a qualified job offer",
    body: "Your job must match your qualification. Ask your employer whether they will use the accelerated skilled worker procedure (beschleunigtes Fachkräfteverfahren), which involves the employer starting the procedure with the local foreigners authority. A job title alone is not enough — the tasks and salary must fit the visa route.",
    documents: [
      "Employment contract or signed job offer",
      "Job description and tasks",
      "Proof that the role matches your qualification",
    ],
    sourceIds: ["miigJobSearch", "miigVisaTypes", "arbeitsagentur"],
    xp: 80,
    tags: ["job"],
    serviceCategory: "career-coaching",
  },
  {
    id: "apply-visa",
    phase: "apply",
    title: profession.blueCardEligible
      ? "Apply for an EU Blue Card or skilled worker visa"
      : "Apply for a skilled worker visa",
    body: "Apply at the German mission responsible for your country of residence. The route depends on your qualification, salary, and occupation. Check the current salary threshold before you sign a contract, and keep your recognition or ZAB documents in the same file as your passport.",
    documents: [
      "Passport and biometric photos",
      "Completed visa application",
      "Job offer or employment contract",
      "Recognised qualification or ZAB statement",
      "Proof of language ability",
      "Health insurance for the initial period",
    ],
    sourceIds: ["miigVisaTypes", "miigVisaApply", "auswaertigesAmt"],
    claimIds: profession.blueCardEligible
      ? ["blueCardSalary", "blueCardShortageSalary"]
      : [],
    xp: 120,
    tags: ["visa"],
    serviceCategory: "visa-paperwork",
  },
];

const jobseekerSteps = () => [
  {
    id: "chancenkarte-check",
    phase: "apply",
    title: "Check whether the Chancenkarte fits you",
    body: "The Chancenkarte lets you enter Germany to look for a job. You need a recognised qualification or a points-based route, basic German or English at the required level, and proof you can cover your living costs. Use the official Quick-Check before you pay for anything.",
    documents: [
      "Qualification documents",
      "Language certificate",
      "CV",
      "Proof of funds",
    ],
    sourceIds: ["miigChancenkarte", "miigQuickCheck", "anerkennungPortal"],
    claimIds: ["chancenkartePoints"],
    xp: 70,
    tags: ["visa", "job"],
    serviceCategory: "visa-paperwork",
  },
  {
    id: "chancenkarte-funds",
    phase: "apply",
    title: "Arrange proof of funds",
    body: "You must show you can cover your living costs while you look for work. Accepted proof can include a blocked account, a declaration of commitment, or other evidence the German mission accepts. Check the current amount and accepted providers with your German mission — the figure changes over time.",
    documents: [
      "Blocked-account confirmation, declaration of commitment, or other accepted proof",
      "Bank statements if requested",
    ],
    sourceIds: ["miigChancenkarte", "auswaertigesAmt"],
    xp: 50,
    tags: ["visa", "funds"],
    serviceCategory: "banking-finance",
  },
  {
    id: "apply-visa",
    phase: "apply",
    title: "Apply for the Chancenkarte",
    body: "Apply at the German mission responsible for your country of residence. The card is issued for a limited job-search period; check the current duration and the rules for part-time work and trial employment before you book flights.",
    documents: [
      "Passport and biometric photos",
      "Completed Chancenkarte application",
      "Qualification documents or points evidence",
      "Proof of funds",
      "Health insurance for the initial period",
    ],
    sourceIds: ["miigChancenkarte", "miigVisaApply"],
    claimIds: ["chancenkarteDuration", "chancenkarteWork"],
    xp: 110,
    tags: ["visa"],
    serviceCategory: "visa-paperwork",
  },
];

const studySteps = () => [
  {
    id: "university-admission",
    phase: "apply",
    title: "Get admission to a German university",
    body: "Apply directly or through uni-assist, depending on the programme. Check whether your school-leaving certificate or degree is recognised, and whether the programme requires German or English proficiency. Keep the admission letter and the programme's language requirement for the visa file.",
    documents: [
      "School-leaving certificate",
      "Degree transcripts",
      "Language certificate",
      "CV and motivation letter if required",
      "Admission letter",
    ],
    sourceIds: ["miigStudy", "daad", "hochschulkompass"],
    xp: 90,
    tags: ["study"],
    serviceCategory: "career-coaching",
  },
  {
    id: "proof-of-funds",
    phase: "apply",
    title: "Arrange your blocked account or scholarship",
    body: "Student visa applicants usually need proof of funds for the first year. A blocked account (Sperrkonto) is common; scholarships or a declaration of commitment may also count. Check the current amount and accepted providers with the German mission — it changes over time.",
    documents: [
      "Blocked-account confirmation or scholarship award",
      "Declaration of commitment if applicable",
      "Bank details for the transfer",
    ],
    sourceIds: ["miigStudy", "auswaertigesAmt"],
    xp: 60,
    tags: ["study", "funds"],
    serviceCategory: "banking-finance",
  },
  {
    id: "apply-visa",
    phase: "apply",
    title: "Apply for a student visa",
    body: "Apply at the German mission responsible for your country of residence with your admission letter, proof of funds, health insurance, and language certificate. Check whether your degree needs a ZAB evaluation before the appointment.",
    documents: [
      "Passport and biometric photos",
      "Admission letter",
      "Proof of funds",
      "Health insurance",
      "Language certificate",
      "ZAB evaluation if required",
    ],
    sourceIds: ["miigStudy", "miigVisaApply"],
    xp: 110,
    tags: ["visa", "study"],
    serviceCategory: "visa-paperwork",
  },
];

const vocationalSteps = () => [
  {
    id: "training-place",
    phase: "apply",
    title: "Find a vocational training place (Ausbildung)",
    body: "Search the official job board and apply early. Your school certificates and German level must meet the employer's requirements; some professions also require recognition of your previous vocational qualification. A training contract is the basis for the visa.",
    documents: [
      "Training contract or signed offer",
      "School certificates and CV",
      "German language certificate",
      "Recognition decision if the profession requires one",
    ],
    sourceIds: ["miigAusbildung", "miigJobBoard", "arbeitsagentur"],
    xp: 80,
    tags: ["training", "job"],
    serviceCategory: "career-coaching",
  },
  {
    id: "apply-visa",
    phase: "apply",
    title: "Apply for a vocational training visa",
    body: "You need a training contract and the language level your employer and the German mission require. Check whether your previous qualification needs recognition before you apply, and keep the recognition correspondence with your visa documents.",
    documents: [
      "Passport and biometric photos",
      "Training contract",
      "School certificates",
      "Language certificate",
      "Recognition decision if required",
      "Health insurance for the initial period",
    ],
    sourceIds: ["miigAusbildung", "miigVisaTypes", "miigVisaApply"],
    xp: 110,
    tags: ["visa", "training"],
    serviceCategory: "visa-paperwork",
  },
];

const universalTailSteps = () => [
  {
    id: "arrival-prep",
    phase: "arrive",
    title: "Prepare for your first week",
    body: "Sort out short-term accommodation, travel, and health insurance before you fly. Keep digital and paper copies of your passport, visa, contract, and insurance. Save the address and opening hours of your local registration office.",
    documents: [
      "Passport and visa",
      "Travel and accommodation booking",
      "Health insurance confirmation",
      "Copies of your contract and certificates",
    ],
    sourceIds: ["miigFirstSteps"],
    xp: 40,
    tags: ["arrival"],
    serviceCategory: "housing",
  },
  {
    id: "anmeldung",
    phase: "arrive",
    title: "Register your address (Anmeldung)",
    body: "Register with the local residents' registration office (Bürgeramt) after you move in. You will need your passport, visa or residence document, and a landlord confirmation (Wohnungsgeberbestätigung). Book the appointment early — waiting times vary by city.",
    documents: [
      "Passport",
      "Landlord confirmation (Wohnungsgeberbestätigung)",
      "Lease or move-in confirmation",
    ],
    sourceIds: ["miigFirstSteps"],
    xp: 60,
    tags: ["arrival", "admin"],
    serviceCategory: "housing",
  },
  {
    id: "residence-permit",
    phase: "settle",
    title: "Apply for your residence permit",
    body: "Book an appointment at the local foreigners authority (Ausländerbehörde) before your visa expires. Bring your passport, biometric photo, insurance, proof of income or funds, and your qualification documents. The appointment is not automatic — book it as soon as you have your address registration.",
    documents: [
      "Passport and visa",
      "Biometric photo",
      "Health insurance",
      "Proof of income or funds",
      "Qualification documents",
      "Anmeldung confirmation",
    ],
    sourceIds: ["bamf", "miigFirstSteps", "miigVisaTypes"],
    xp: 90,
    tags: ["visa", "admin"],
    serviceCategory: "visa-paperwork",
  },
  {
    id: "admin-setup",
    phase: "settle",
    title: "Set up bank, tax ID, and insurance",
    body: "Open a German bank account, activate your tax identification number (Steuer-ID), and confirm your health insurance. Some employers need your tax ID before the first payroll. Keep your registration confirmation — several offices will ask for it.",
    documents: [
      "Anmeldung confirmation",
      "Passport",
      "Employment contract or admission letter",
      "Health insurance membership confirmation",
    ],
    sourceIds: ["miigFirstSteps", "bzst", "bmg"],
    xp: 60,
    tags: ["admin"],
    serviceCategory: "banking-finance",
  },
  {
    id: "start-life",
    phase: "settle",
    title: "Start work or study and build your network",
    body: "Join a language course, a professional network, or a local club. Your first months are easier with a small group of people who can explain local systems. Keep copies of every official letter until you know it is no longer needed.",
    documents: ["Your first payslip or enrolment confirmation"],
    sourceIds: ["miigFirstSteps", "miigJobSearch"],
    xp: 50,
    tags: ["integration"],
    serviceCategory: "cultural-integration",
  },
];

const goalSteps = (goalId, profession) => {
  if (goalId === "jobseeker") return jobseekerSteps();
  if (goalId === "study") return studySteps();
  if (goalId === "vocational") return vocationalSteps();
  return workSteps(profession);
};

export class PathBuildError extends Error {
  constructor(message) {
    super(message);
    this.name = "PathBuildError";
  }
}

export function buildPath({
  professionId,
  countryCode,
  goal: goalId = "work",
  now = new Date(),
} = {}) {
  const profession = getProfession(professionId);
  if (!profession) {
    throw new PathBuildError(`Unknown profession "${professionId}"`);
  }

  const country = getCountry(countryCode);
  const countryLabel = getCountryLabel(country.code);
  const goal = getGoal(goalId) || getGoal("work");

  let order = 0;
  const steps = [];
  const add = (step) => {
    steps.push(normalizeStep({ ...step, order: order++ }));
  };

  add({
    id: "quick-check",
    phase: "prepare",
    title: "Run the official Quick-Check",
    body: "Answer the Federal Government's Quick-Check for your plan: work, study, vocational training, founding a business, or research. It confirms which visa route fits your situation before you spend money on documents or courses.",
    documents: ["Your answers to the Quick-Check (screenshot or PDF)"],
    sourceIds: ["miigQuickCheck", "miigHome"],
    xp: 30,
    tags: ["start"],
    serviceCategory: "visa-paperwork",
  });

  add(originDocumentsStep(country, countryLabel));
  add(recognitionStep(profession, goal.id));
  add(languageStep(profession));
  goalSteps(goal.id, profession).forEach(add);
  universalTailSteps().forEach(add);

  const stepSourceIds = steps.flatMap((step) => step.sourceIds);
  const stepClaimIds = steps.flatMap((step) => step.claimIds);
  const claims = resolveClaims(stepClaimIds, now).map((claim) => ({
    ...claim,
    source: SOURCES[claim.sourceId] || null,
  }));
  const sources = resolveSources([
    ...stepSourceIds,
    ...claims.map((claim) => claim.sourceId),
  ]);

  return {
    id: `${profession.id}-${country.code}-${goal.id}`,
    profession,
    country: { ...country, label: countryLabel },
    goal,
    title: `${profession.label} from ${countryLabel}`,
    subtitle: goal.label,
    summary: `${profession.summary} This path is tailored for someone starting from ${countryLabel} with the goal: ${goal.shortLabel.toLowerCase()}.`,
    steps,
    phases: PHASES.map((phase) => ({
      ...phase,
      steps: steps.filter((step) => step.phase === phase.id),
    })).filter((phase) => phase.steps.length > 0),
    totalXp: steps.reduce((sum, step) => sum + step.xp, 0),
    claims,
    sources,
    lastReviewed: "2026-11-20",
    reviewCadenceDays: 90,
    disclaimer: PATH_DISCLAIMER,
  };
}

export function tryBuildPath(input) {
  try {
    return { path: buildPath(input), error: null };
  } catch (error) {
    return { path: null, error };
  }
}

export const getPathHref = (path) =>
  `/paths/${path.profession.id}/${path.country.code}?goal=${path.goal.id}`;

export const isPathReviewDue = (path, date = new Date()) => {
  const reviewed = Date.parse(path.lastReviewed);
  if (Number.isNaN(reviewed)) return true;
  const age = date.getTime() - reviewed;
  return age > (path.reviewCadenceDays || 90) * 24 * 60 * 60 * 1000;
};

/**
 * Data-integrity check used by the evals. Returns an array of human-readable
 * issues; an empty array means the path is shippable.
 */
export function validatePath(path) {
  const issues = [];
  if (!path) return ["Path is empty"];

  if (!path.id) issues.push("Path has no id");
  if (!path.title) issues.push("Path has no title");
  if (!Array.isArray(path.steps) || path.steps.length === 0) {
    issues.push("Path has no steps");
    return issues;
  }

  const ids = new Set();
  for (const step of path.steps) {
    if (!step.id) issues.push("A step has no id");
    if (ids.has(step.id)) issues.push(`Duplicate step id "${step.id}"`);
    ids.add(step.id);

    if (!step.title) issues.push(`Step "${step.id}" has no title`);
    if (!step.body) issues.push(`Step "${step.id}" has no body`);
    if (!PHASE_IDS.includes(step.phase)) {
      issues.push(`Step "${step.id}" has unknown phase "${step.phase}"`);
    }
    if (!(step.xp > 0)) issues.push(`Step "${step.id}" has no positive XP`);
    if (!step.sourceIds?.length) {
      issues.push(`Step "${step.id}" has no official source`);
    }
    for (const sourceId of step.sourceIds || []) {
      if (!SOURCES[sourceId]) {
        issues.push(`Step "${step.id}" references unknown source "${sourceId}"`);
      }
    }
    for (const claimId of step.claimIds || []) {
      if (!path.claims?.some((claim) => claim.id === claimId)) {
        issues.push(`Step "${step.id}" references unresolved claim "${claimId}"`);
      }
    }
    const copy = `${step.title} ${step.body}`;
    if (BANNED_COPY.some((pattern) => pattern.test(copy))) {
      issues.push(`Step "${step.id}" contains a banned claim or guarantee`);
    }
  }

  const expectedXp = path.steps.reduce((sum, step) => sum + step.xp, 0);
  if (path.totalXp !== expectedXp) {
    issues.push(
      `totalXp is ${path.totalXp} but steps add up to ${expectedXp}`,
    );
  }

  const sourceIds = new Set(path.sources?.map((source) => source.id) || []);
  for (const step of path.steps) {
    for (const sourceId of step.sourceIds) {
      if (!sourceIds.has(sourceId)) {
        issues.push(`Source "${sourceId}" is missing from path.sources`);
      }
    }
  }

  if (!path.disclaimer) issues.push("Path has no disclaimer");
  if (Number.isNaN(Date.parse(path.lastReviewed))) {
    issues.push("Path has no valid lastReviewed date");
  }

  return issues;
}

export const ALL_PROFESSION_IDS = PROFESSIONS.map((profession) => profession.id);
