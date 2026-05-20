import { api } from "../../../../api/client";

export const fetchBadgeCounts = async () => {
  const { data } = await api.get("/dashboard/badge-counts");
  return data;
};

export const dummyBadgeCounts = async () => {
  return {
    messages: 5,
    notifications: 3,
    orders: 14,
    verification: 1,
    providers: 3,
  };
};