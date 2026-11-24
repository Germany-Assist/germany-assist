/**
 * Goals change the middle of a path. Universal steps (Quick-Check, documents,
 * recognition, language, arrival, Anmeldung, residence permit, admin, life)
 * stay in every path.
 */

export const GOALS = [
  {
    id: "work",
    label: "I have (or want) a qualified job offer",
    shortLabel: "Work",
    description:
      "You want to arrive with a job contract and apply for a skilled worker visa or EU Blue Card.",
    iconKey: "briefcase",
  },
  {
    id: "jobseeker",
    label: "I want to arrive first and look for work",
    shortLabel: "Job search",
    description:
      "You want to use the Chancenkarte (Opportunity Card) or another job-seeker route to look for a qualified job in Germany.",
    iconKey: "search",
  },
  {
    id: "study",
    label: "I want to study at a German university",
    shortLabel: "Study",
    description:
      "You want admission to a German university and a student visa.",
    iconKey: "graduation-cap",
  },
  {
    id: "vocational",
    label: "I want to start vocational training (Ausbildung)",
    shortLabel: "Ausbildung",
    description:
      "You want a dual or school-based vocational training place and the matching visa.",
    iconKey: "wrench",
  },
];

export const GOALS_BY_ID = Object.freeze(
  GOALS.reduce((acc, goal) => {
    acc[goal.id] = goal;
    return acc;
  }, {}),
);

export const getGoal = (id) => GOALS_BY_ID[id] || null;

export const GOAL_IDS = Object.freeze(Object.keys(GOALS_BY_ID));
