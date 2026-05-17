import { api } from "./client";

export const fetchMetadata = async () => {
  const resp = await api.get("/meta/");
  return resp;
};

export const fetchCategoriesForRegister = async () => {
  const data = await api.get("/category");
  return data.data;
};
