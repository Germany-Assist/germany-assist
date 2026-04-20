export const NODE_ENV = import.meta.env.VITE_NODE_ENV;
export const LOCAL_BACKEND_URL = import.meta.env.VITE_LOCAL_BACKEND_URL;
export const DROPLET_BACKEND_URL = import.meta.env.VITE_DROPLET_BACKEND_URL;
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export const STRIPE_KEY = import.meta.env.VITE_STRIPE_SK;
export const STAGING_BACKEND_URL = import.meta.env.VITE_DROPLET_STAGING_URL;

export const API_URL =
  NODE_ENV === "production"
    ? `${DROPLET_BACKEND_URL}/api`
    : NODE_ENV === "staging"
      ? `${STAGING_BACKEND_URL}/api`
      : `${LOCAL_BACKEND_URL}/api`;
