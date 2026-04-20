// src/api/adminApi.js
import { api } from "./client";

// Get all admin users
export const getAllUsers = async () => {
  const res = await api.get("/user/admin/all");
  return res.data;
};

// Create new admin
export const createAdmin = async (payload) => {
  const res = await api.post("/user/admin", payload);
  return res.data;
};

// Verify admin user
export const verifyUser = async (userId) => {
  const res = await api.get(`/auth/admin/verify/${userId}`);
  return res.data;
};

/* ---------------------- Categories ---------------------- */

// Get all categories
export const getAllCategories = async () => {
  const res = await api.get("/category");
  return res.data;
};

// Create new category
export const createCategory = async (payload) => {
  const res = await api.post("/category", payload);
  return res.data;
};

// Update category
export const updateCategory = async (payload) => {
  const res = await api.put("/category", payload);
  return res.data;
};

/* ---------------------- Services ---------------------- */

// Get all services (admin view)
export const getAllServices = async (params) => {
  const queryString = params
    ? `?${new URLSearchParams(params).toString()}`
    : "";
  const res = await api.get(`/service/admin/services${queryString}`);
  return res.data;
};

export const getAllServicesStatistical = async () => {
  const res = await api.get(`/dashboard/admin/services`);
  return res.data;
};
export const getAllFinanceStatistical = async () => {
  const res = await api.get(`/dashboard/admin/finance`);
  return res.data;
};

// Approve or reject a service
export const updateServiceStatus = async (id, payload) => {
  const res = await api.put(`/service/admin/services/status/${id}`, payload);
  return res.data;
};

// Restore deleted service
export const restoreService = async (serviceId) => {
  const res = await api.post(`/service/admin/services/${serviceId}/restore`);
  return res.data;
};

/* ---------------------- Assets ---------------------- */

// Upload asset (image/video)
export const uploadAsset = async (formData) => {
  const res = await api.post(
    "/asset/upload/admin/post/video/appAssets",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return res.data;
};

// Get all assets
export const getAllAssets = async () => {
  const res = await api.get("/asset/");
  return res.data;
};

// Delete asset by admin
export const deleteAsset = async (assetId) => {
  const res = await api.delete(`/asset/admin/${assetId}`);
  return res.data;
};

/* ---------------------- Orders ---------------------- */

// Get all orders (admin)
export const getAllOrders = async (params = {}) => {
  const res = await api.get("/order/admin", { params });
  return res.data;
};

// Get order by ID
export const getOrderById = async (orderId) => {
  const res = await api.get(`/order/admin/${orderId}`);
  return res.data;
};
/* ---------------------- service provider ---------------------- */
export const createServiceProvider = async (payload = {}) => {
  const res = await api.post("/serviceProvider", payload);
  return res.data;
};

export const getAllRequests = async (filters) => {
  const queryString = filters
    ? `?${new URLSearchParams(filters).toString()}`
    : "";
  const res = await api.get(`/requests/admin${queryString}`);
  return res.data;
};
export const updateRequest = async (id, payload = {}) => {
  const res = await api.put(`/requests/admin/${id}`, payload);
  return res.data;
};
export const getServiceProfile = async (id) => {
  const res = await api.get(`/service/admin/services/${id}`);
  return res.data;
};
const adminApis = {
  getServiceProfile,
  getOrderById,
  updateRequest,
  getAllOrders,
  getAllRequests,
  deleteAsset,
  getAllAssets,
  uploadAsset,
  restoreService,
  updateServiceStatus,
  getAllServices,
  updateCategory,
  getAllCategories,
  createCategory,
  verifyUser,
  createAdmin,
  getAllUsers,
  createServiceProvider,
};
export default adminApis;
