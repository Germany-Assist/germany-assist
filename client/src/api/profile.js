import { api } from "./client";

export const profileRequest = async () => {
  const res = await api.get("/auth/profile");
  return res.data; // { user }
};
export const uploadProfileImage = async (payload) => {
  const res = await api.post(
    "/asset/upload/users/post/image/profileImage",
    payload,
  );
  return res.data; // { user }
};
export const addToFavoriteApi = async (id) => {
  const res = await api.put(`/service/client/favorite/${id}`);
  return res.status == 201;
};
export const removeFromFavoriteApi = async (id) => {
  const res = await api.delete(`/service/client/favorite/${id}`);
  return res.status == 200;
};
export const fetchTimelineApi = async (id, page) => {
  const res = await api.get(
    `/service/timeline/client/readTimeline/${id}?page=${page}`,
  );
  return res.data;
};
export const fetchAllPostsApi = async (timelineId, page) => {
  const res = await api.get(`/post/getPosts/${timelineId}/${page}`);
  return res.data;
};
// review
export const fetchAllReviewsApi = async (serviceId) => {
  const res = await api.get(`/review/service/${serviceId}`);
  return res.data;
};
export const fetchUserReviewForServiceApi = async (serviceId) => {
  const res = await api.get(`/review/serviceUser/${serviceId}`);
  return res.data;
};
export const createNewReviewApi = async (payload) => {
  const res = await api.post(`/review`, payload);
  return res.data;
};
export const updateExistingReviewApi = async (payload) => {
  const res = await api.put(`/review`, payload);
  return res.data;
};
