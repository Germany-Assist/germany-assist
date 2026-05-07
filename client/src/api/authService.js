import { api } from "./client";

export const checkEmailExists = async (email) => {
  const res = await api.post("/auth/check-email", { email }, {
    skipAuthRefresh: true,
  });
  return res.data; // { exists: boolean }
};

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
  return res.data;
};

export const signUpClient = async (data) => {
  const res = await api.post("/user/", data);
  return res.data;
};

export const signUpFreelancer = async (data) => {
  const res = await api.post("/serviceProvider/freelancer/signup", data);
  return res.data;
};

export const signUpCompany = async (data) => {
  const res = await api.post("/serviceProvider/company/signup", data);
  return res.data;
};

export const googleLoginRequest = async (credential) => {
  const res = await api.post("/auth/google/signin", {
    credential,
  });
  return res.data; // { user, accessToken }
};
export const googleRetrieveInfo = async (credential) => {
  const res = await api.post("/auth/google/retrieveInfo", {
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

export const forgotPassword = async (email) => {
  const res = await api.post(`/auth/password-reset`, { email }, { skipAuthRefresh: true });
  return res.data;
};

export const verifyResetCode = async (code) => {
  const res = await api.post(`/auth/verify-reset-code`, { code }, { skipAuthRefresh: true });
  return res.data;
};

export const resetPassword = async ({ token, password }) => {
  const res = await api.post(`/auth/password-reset/confirm`, { token, password }, { skipAuthRefresh: true });
  return res.data;
};
