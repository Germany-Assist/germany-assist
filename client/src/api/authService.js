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
    { skipAuthRefresh: true },
  );
  return res.data.accessToken;
};

export const signUpClient = async (data) => {
  const res = await api.post("/user/", data);
  return res.data;
};

export const signUpFreelancer = async (data) => {
  const res = await api.post("/provider/signup", data);
  return res.data;
};

export const signUpCompany = async (data) => {
  const res = await api.post("/company/signup", data);
  return res.data;
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

export const verifyAccountConfirmResponse = async ({ token, email }) => {
  const res = await api.post(`/auth/verifyAccount`, { token, email });
  return res.data;
};
export const resendVerificationEmail = async (email) => {
  const res = await api.post(`/auth/resendVerificationEmail`, { email });
  return res.data;
};
