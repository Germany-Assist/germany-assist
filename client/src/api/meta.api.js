import { api } from "./client";

export const fetchMetadata = async () => {
  const resp = await api.get("/meta/");
  return resp;
};
