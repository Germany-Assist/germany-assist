import { api } from "./client";

export const fetchMetadata = async () => {
  const resp = await api.get("/meta/");
  return resp;
};

export const fetchCategoriesForRegister = async () => {
  const data = await api.get("/meta/register/categories");
  return data.data;
};

export const fetchIdentityRequests = async () => {
  const data = await api.get("/meta/requests/identity");
  return data.data;
};
