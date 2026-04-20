import axios from "axios";
import { API_URL } from "../config/api";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const setupInterceptors = ({
  getAccessToken,
  refreshAccessToken,
  onLogout,
}) => {
  let isRefreshing = false;
  let queue = [];

  const processQueue = (error, token = null) => {
    queue.forEach((prom) => {
      if (error) prom.reject(error);
      else prom.resolve(token);
    });
    queue = [];
  };

  api.interceptors.request.clear();
  api.interceptors.response.clear();

  api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      const original = err.config;
      if (original?.skipAuthRefresh) return Promise.reject(err);

      if (err.response?.status === 401 && !original._retry) {
        original._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            queue.push({
              resolve: (token) => {
                original.headers.Authorization = `Bearer ${token}`;
                resolve(api(original));
              },
              reject,
            });
          });
        }

        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          processQueue(null, newToken);

          // Ensure the new token is in the headers for the retry
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          onLogout();
          return Promise.reject(refreshErr);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(err);
    },
  );
};
