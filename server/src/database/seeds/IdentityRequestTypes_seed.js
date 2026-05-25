import IdentityRequestType from "../models/IdentityRequestTypes.js";

const seeds = [
  {
    id: 1,
    title: "Personal Identification",
    label: "Passport or National ID",
    icon: "👤",
    requirements: [
      "Valid Passport",
      "National Identity Card",
      "Residence Permit (Aufenthaltstitel)",
    ],
  },
  {
    id: 2,
    title: "profOfResidence",
    label: "Proof of Residence",
    icon: "🏠",
    requirements: [
      "Utility Bill (Gas, Water, Electricity)",
      "Internet or Landline Bill",
      "Official Bank Statement",
      "Registration Certificate (Meldebescheinigung)",
    ],
  },
  {
    id: 3,
    title: "businessRegistration",
    label: "Business Registration",
    icon: "💼",
    requirements: [
      "Business Registration (Gewerbeanmeldung)",
      "Commercial Register Extract (Handelsregisterauszug)",
      "Freelance Tax Certificate (Steuernummer-Bescheinigung)",
    ],
  },
];

const seedIdentityRequestTypes = async () => {
  await IdentityRequestType.bulkCreate(seeds, {
    updateOnDuplicate: ["title", "label", "icon", "requirements"],
  });
};

export default seedIdentityRequestTypes;
