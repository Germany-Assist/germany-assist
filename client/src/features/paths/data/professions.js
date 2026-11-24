/**
 * Profession rules used to assemble a relocation path.
 *
 * `recognition`:
 * - "required"    — the profession is regulated; recognition/approbation is
 *                   needed before you can work independently.
 * - "recommended" — recognition is not always mandatory, but a ZAB statement
 *                   or chamber assessment usually strengthens the visa file.
 * - "optional"    — no regulated recognition for most roles; a statement of
 *                   comparability can still help.
 * - "check"       — we do not have enough information to say; the step sends
 *                   the customer to the official recognition portal.
 */

export const PROFESSIONS = [
  {
    id: "software-engineer",
    label: "Software engineer / IT specialist",
    shortLabel: "IT specialist",
    iconKey: "code",
    group: "IT & engineering",
    summary:
      "Build software, data, or infrastructure for a German employer. Many teams hire in English, but client-facing and public-sector roles often ask for German.",
    regulated: false,
    recognition: "recommended",
    recognitionBody:
      "A university degree usually needs a ZAB Statement of Comparability for the visa file. IT specialists without a formal degree may qualify through comparable professional experience under the Blue Card rules — confirm the current route with the German mission before you apply.",
    languageNote:
      "Many IT teams work in English; German helps for client-facing roles and for everyday life.",
    blueCardEligible: true,
    shortageOccupation: true,
    category: "career-coaching",
    keyDocuments: [
      "Degree certificate and transcripts, or evidence of comparable IT experience",
      "CV in German or English",
      "Signed job offer or employment contract",
      "Proof of language ability",
    ],
    claimIds: ["blueCardSalary", "blueCardShortageSalary"],
  },
  {
    id: "nurse",
    label: "Nurse / care professional",
    shortLabel: "Nurse",
    iconKey: "heart-pulse",
    group: "Health & care",
    summary:
      "Work as a recognised nursing professional in hospitals, care homes, or community care. Nursing is regulated, so recognition comes before the job offer is useful.",
    regulated: true,
    recognition: "required",
    recognitionTitle: "Get your nursing qualification recognised",
    recognitionBody:
      "Nursing is regulated in Germany. Apply to the competent state authority for recognition as a Pflegefachfrau/Pflegefachmann. The authority may require an adaptation course (Anpassungslehrgang) or a knowledge test (Kenntnisprüfung), and German at the level it sets — often B1 or B2. Do not book a language course before the authority confirms the requirement.",
    languageNote:
      "The recognition authority sets the German level, often B1 or B2. Ask for the decision in writing before you pay for a course.",
    blueCardEligible: true,
    shortageOccupation: true,
    category: "visa-paperwork",
    keyDocuments: [
      "Nursing qualification and transcripts",
      "Curriculum and proof of practical training hours",
      "German language certificate at the required level",
      "Recognition decision or application confirmation",
    ],
    claimIds: ["blueCardSalary", "blueCardShortageSalary"],
  },
  {
    id: "doctor",
    label: "Doctor / physician",
    shortLabel: "Doctor",
    iconKey: "stethoscope",
    group: "Health & care",
    summary:
      "Practise medicine in Germany. Doctors need a licence to practise (Approbation) from the competent state authority, not just a translated degree.",
    regulated: true,
    recognition: "required",
    recognitionTitle: "Apply for your Approbation",
    recognitionBody:
      "Doctors need a licence to practise (Approbation) from the competent state authority. Expect document checks, a German language test (generally advanced, often C1), and possibly a knowledge test (Kenntnisprüfung). The exact route depends on your qualification and federal state; start with the recognition portal and the state authority before you sign a job contract.",
    languageNote:
      "Medical German is demanding. Approbation usually requires advanced German, often C1; the state authority confirms the exact level.",
    blueCardEligible: true,
    shortageOccupation: true,
    category: "visa-paperwork",
    keyDocuments: [
      "Medical degree and transcripts",
      "Specialist or postgraduate certificates",
      "German language certificate",
      "Approbation application and state-authority correspondence",
    ],
    claimIds: ["blueCardSalary", "blueCardShortageSalary"],
  },
  {
    id: "engineer",
    label: "Engineer (mechanical, civil, electrical)",
    shortLabel: "Engineer",
    iconKey: "cog",
    group: "IT & engineering",
    summary:
      "Work as an engineer in manufacturing, construction, energy, or infrastructure. Some engineering activities are regulated; most need a recognised degree and a strong technical CV.",
    regulated: false,
    recognition: "recommended",
    recognitionBody:
      "For most engineering jobs a ZAB Statement of Comparability supports the visa file. Some activities — especially those with safety responsibility — are regulated and need recognition by the competent chamber or authority. Check the recognition portal for your exact title.",
    languageNote:
      "Engineering teams often work in English, but German is common on construction sites, in public infrastructure, and in client-facing roles.",
    blueCardEligible: true,
    shortageOccupation: true,
    category: "career-coaching",
    keyDocuments: [
      "Engineering degree and transcripts",
      "ZAB statement or recognition decision if available",
      "Technical CV and project list",
      "Signed job offer or contract",
    ],
    claimIds: ["blueCardSalary", "blueCardShortageSalary"],
  },
  {
    id: "teacher",
    label: "Teacher / lecturer",
    shortLabel: "Teacher",
    iconKey: "graduation-cap",
    group: "Education",
    summary:
      "Teach at a school, vocational college, or language institute. School teaching is regulated by the federal state, and recognition rules differ across Germany.",
    regulated: true,
    recognition: "required",
    recognitionTitle: "Get your teaching qualification recognised",
    recognitionBody:
      "School teaching is regulated by the federal state (Land). Apply to the state education authority for Lehramtsanerkennung. Expect a document check, a language requirement, and possibly additional training or a probationary period. The route for a language school or adult education role can be different — confirm the exact job title with the employer.",
    languageNote:
      "Teaching usually requires advanced German, often C1 or C2, set by the state authority or employer.",
    blueCardEligible: true,
    shortageOccupation: true,
    category: "language-learning",
    keyDocuments: [
      "Teaching degree and transcripts",
      "Proof of teaching practice",
      "German language certificate",
      "State authority recognition correspondence",
    ],
    claimIds: ["blueCardSalary", "blueCardShortageSalary"],
  },
  {
    id: "accountant",
    label: "Accountant / finance professional",
    shortLabel: "Accountant",
    iconKey: "calculator",
    group: "Business & finance",
    summary:
      "Work in accounting, controlling, payroll, or financial analysis. German tax and payroll rules are local, so language and local knowledge matter more than a regulated licence.",
    regulated: false,
    recognition: "optional",
    recognitionBody:
      "Most accounting and finance roles are not regulated. A ZAB Statement of Comparability can still help the visa file and employers understand your degree. German tax law and payroll practice are usually learned on the job or through a local qualification.",
    languageNote:
      "Client-facing finance roles usually need German at B2 or above; international controlling teams may work in English.",
    blueCardEligible: true,
    shortageOccupation: false,
    category: "career-coaching",
    keyDocuments: [
      "Degree certificate and transcripts",
      "CV with systems and reporting experience",
      "Signed job offer or contract",
      "German language certificate if the role requires it",
    ],
    claimIds: ["blueCardSalary"],
  },
  {
    id: "chef",
    label: "Chef / hospitality professional",
    shortLabel: "Chef",
    iconKey: "chef-hat",
    group: "Hospitality",
    summary:
      "Work in restaurants, hotels, or catering. Hospitality is not a regulated profession for most roles, but a recognised vocational qualification and German basics make hiring easier.",
    regulated: false,
    recognition: "optional",
    recognitionBody:
      "Most chef roles are not regulated. If you trained through a formal vocational programme, recognition of your qualification by the competent chamber (IHK/HWK) can help the visa file. Practical experience and a trial shift often matter more to employers.",
    languageNote:
      "Kitchen German is practical; A2–B1 helps with hygiene instructions, schedules, and teamwork. Some international hotels work in English.",
    blueCardEligible: false,
    shortageOccupation: true,
    category: "career-coaching",
    keyDocuments: [
      "Vocational certificate or proof of professional experience",
      "CV and references",
      "Signed job offer or training contract",
      "German language certificate if required",
    ],
    claimIds: [],
  },
  {
    id: "electrician",
    label: "Electrician / skilled trade",
    shortLabel: "Electrician",
    iconKey: "zap",
    group: "Skilled trades",
    summary:
      "Work as an electrician or in a related skilled trade. Electrical work is regulated in Germany and usually needs recognition by the Handwerkskammer.",
    regulated: true,
    recognition: "required",
    recognitionTitle: "Get your trade recognised by the Handwerkskammer",
    recognitionBody:
      "Electrical work is regulated. Apply to the competent Handwerkskammer (HWK) for recognition of your qualification. The chamber may require a compensation measure, an adaptation period, or a trade test, and German at the level it sets — often B1. Do not start work independently before the recognition decision.",
    languageNote:
      "The chamber and employer usually expect at least B1 German for safety instructions and customer contact.",
    blueCardEligible: false,
    shortageOccupation: true,
    category: "visa-paperwork",
    keyDocuments: [
      "Vocational certificate and training record",
      "Proof of practical work experience",
      "German language certificate",
      "Handwerkskammer recognition correspondence",
    ],
    claimIds: [],
  },
  {
    id: "general",
    label: "Other profession / not listed",
    shortLabel: "Other",
    iconKey: "compass",
    group: "Other",
    summary:
      "A starting path for a profession we do not cover yet. It uses the official Quick-Check, recognition portal, and visa overview so you can confirm your own route.",
    regulated: false,
    recognition: "check",
    recognitionBody:
      "We do not have a profession-specific rule for your role yet. Use the official recognition portal to check whether your qualification is regulated, and the Quick-Check to confirm the visa route. A ZAB Statement of Comparability may still help.",
    languageNote:
      "The language level depends on your profession, employer, and recognition authority. Confirm it before booking an exam.",
    blueCardEligible: true,
    shortageOccupation: false,
    category: "visa-paperwork",
    keyDocuments: [
      "Qualification certificates and transcripts",
      "CV",
      "Passport",
      "Job offer, admission letter, or training contract",
    ],
    claimIds: ["blueCardSalary"],
  },
];

export const PROFESSIONS_BY_ID = Object.freeze(
  PROFESSIONS.reduce((acc, profession) => {
    acc[profession.id] = profession;
    return acc;
  }, {}),
);

export const getProfession = (id) => PROFESSIONS_BY_ID[id] || null;

export const PROFESSION_IDS = Object.freeze(Object.keys(PROFESSIONS_BY_ID));
