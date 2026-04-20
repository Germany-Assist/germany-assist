import { api } from "./client";

export const loginRequest = async (credentials) => {
  const res = await api.post("/auth/login", credentials, {
    headers: { "Content-Type": "application/json" },
    skipAuthRefresh: true,
  });
  return res.data; // { user, accessToken }
};
export const refreshTokenRequest = async () => {
  const res = await api.post(
    "/auth/refresh-token",
    {},
    { skipAuthRefresh: true }
  );
  return res.data.accessToken;
};
export const signUpRequest = async (data) => {
  const res = await api.post("/user/", data);
  return res.data; // { user, accessToken }
};

export const googleLoginRequest = async (credential) => {
  const res = await api.post("/auth/google", {
    credential,
  });
  return res.data; // { user, accessToken }
};
export const logoutRequest = async () => {
  await api.get("/auth/logout");
};
