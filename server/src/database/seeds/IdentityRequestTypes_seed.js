import IdentityRequestType from "../models/IdentityRequestTypes.js";

const seeds = [
  {
    id: 1,
    title: "Personal Identification",
    label: "Passport or National ID",
    icon: "👤",
    requirements: [],
  },
  {
    id: 2,
    title: "profOfResidence",
    label: "Proof of Residence",
    icon: "🏠",
    requirements: [],
  },
  {
    id: 3,
    title: "businessRegistration",
    label: "Business Registration",
    icon: "💼",
    requirements: [],
  },
];
const seedIdentityRequestTypes = async () => {
  await IdentityRequestType.bulkCreate(seeds);
};
export default seedIdentityRequestTypes;
