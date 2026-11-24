import {
  Briefcase,
  Calculator,
  ChefHat,
  Code2,
  Cog,
  Compass,
  FolderCheck,
  Footprints,
  GraduationCap,
  HeartPulse,
  Home,
  PlaneLanding,
  Search,
  Send,
  Stethoscope,
  Wrench,
  Zap,
} from "lucide-react";

const FALLBACK = Compass;

const PROFESSION_ICONS = {
  code: Code2,
  "heart-pulse": HeartPulse,
  stethoscope: Stethoscope,
  cog: Cog,
  "graduation-cap": GraduationCap,
  calculator: Calculator,
  "chef-hat": ChefHat,
  zap: Zap,
  compass: Compass,
};

const GOAL_ICONS = {
  briefcase: Briefcase,
  search: Search,
  "graduation-cap": GraduationCap,
  wrench: Wrench,
};

const BADGE_ICONS = {
  footprints: Footprints,
  "folder-check": FolderCheck,
  send: Send,
  "plane-landing": PlaneLanding,
  home: Home,
};

export const getProfessionIcon = (key) => PROFESSION_ICONS[key] || FALLBACK;
export const getGoalIcon = (key) => GOAL_ICONS[key] || FALLBACK;
export const getBadgeIcon = (key) => BADGE_ICONS[key] || FALLBACK;
