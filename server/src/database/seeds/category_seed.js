import Category from "../models/category.js";

const categories = [
  {
    id: 1,
    title: "career-coaching",
    label: "Career Coaching",
    icon: "💼",
    requirements: [
      {
        icon: "🏅",
        title: "Coaching Credentials (ICF, EMCC, or similar)",
        badge: "Certified Coach",
        description:
          'Are you a Professional Coach? Upload your credentials to earn the "Certified Coach" badge.',
      },
      {
        icon: "📊",
        title: "Anonymized Case Studies / Proof of Experience",
        badge: "German Market Expert",
        description:
          'Expert in the German Market? Upload anonymized case studies or proof of experience to earn the "German Market Expert" badge.',
      },
    ],
  },
  {
    id: 2,
    title: "certificate-recognition",
    label: "Certificate Recognition",
    icon: "🏅",
    requirements: [
      {
        icon: "🏥",
        title: "Successful Defizitbescheid or Approbation Cases",
        badge: "Recognition Expert",
        description:
          'Expert in Medical or Engineering Recognition? Upload successful "Defizitbescheid" or "Approbation" cases to earn the "Recognition Expert" badge.',
      },
    ],
  },
  {
    id: 3,
    title: "german-language",
    label: "German Language",
    icon: "🇩🇪",
    requirements: [
      {
        icon: "📜",
        title: "Teaching Certificate",
        badge: "Certified Teacher / Certified Examiner",
        description:
          'Are you a Goethe/TELC/TestDaF teacher? Upload your teaching certificate to earn the "Certified Teacher" or "Certified Examiner" badge.',
      },
      {
        icon: "🎓",
        title: "Germanistics Degree",
        badge: "Expert Teacher",
        description:
          'Do you have a University Degree in Germanistics? Upload it to earn the "Expert Teacher" badge.',
      },
      {
        icon: "🏫",
        title: "Exam Center Accreditation",
        badge: "Certified Exam Center",
        description:
          'Are you an Official Exam Center? Upload your Exam Center Accreditation to be listed as a "Certified Exam Center." Required to publish.',
      },
    ],
  },
  {
    id: 4,
    title: "translation-services",
    label: "Translation Services",
    icon: "📝",
    requirements: [
      {
        icon: "📝",
        title: "Translation Degree",
        badge: "Certified Translator",
        description:
          'General Translator? Upload your degree to earn the "Certified Translator" badge.',
      },
      {
        icon: "⚖️",
        title: "Court Appointment (Bestallungsurkunde) + Official Stamp",
        badge: "Sworn Translator",
        description:
          'Sworn Translator? Upload your Court Appointment and Official Stamp. Required to be verified and published as a "Sworn Translator."',
      },
    ],
  },
  {
    id: 5,
    title: "visa-immigration",
    label: "Visa & Immigration",
    icon: "✈️",
    requirements: [
      {
        icon: "✅",
        title: 'Anonymized "Visa Granted" Documents',
        badge: "Certified Consultant",
        description:
          'Have a high success rate? Upload anonymized "Visa Granted" documents to earn the "Certified Consultant" badge and build client trust.',
      },
    ],
  },
  {
    id: 6,
    title: "recruitment-services",
    label: "Recruitment Services",
    icon: "🤝",
    requirements: [
      {
        icon: "💼",
        title: "Track Record or Portfolio",
        badge: "Certified Recruiter",
        description:
          'Individual Recruiter? Upload your track record or portfolio to earn the "Certified Recruiter" badge.',
      },
      {
        icon: "🏢",
        title: "Recruitment License",
        badge: "Licensed Agency",
        description:
          'Are you an Agency? Upload your Recruitment License to publish your agency profile and earn the "Licensed Agency" badge.',
      },
    ],
  },
  {
    id: 7,
    title: "relocation-services",
    label: "Relocation Services",
    icon: "🏠",
    requirements: [
      {
        icon: "📍",
        title: "Proof of Local Residency or Anmeldung Experience",
        badge: "Local Relocation Expert",
        description:
          'Local Expert? Upload proof of your local residency or experience in city registration (Anmeldung) to earn the "Local Relocation Expert" badge.',
      },
    ],
  },
  {
    id: 8,
    title: "university-student-services",
    label: "University Student Services",
    icon: "🎓",
    requirements: [
      {
        icon: "🎓",
        title: "Proof of Student Placements",
        badge: "Admission Expert",
        description:
          'Successful Admission History? Upload proof of student placements to earn the "Admission Expert" badge.',
      },
      {
        icon: "📄",
        title: "C1 / TestDaF Certificate",
        badge: "Academic Language Expert",
        description:
          "Advanced German Skills? Upload your C1/TestDaF certificate to show clients you understand academic requirements.",
      },
    ],
  },
];
const seedCategory = async () => {
  await Category.bulkCreate(categories);
};
export default seedCategory;
