import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_USERS,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      const response = await axiosInstance("/refresh-token");
      localStorage.setItem("admin-token", response.data.accessToken);
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("admin-token");
    if (token) {
      request.withCredentials = true;
      request.headers.Authorization = token;
    }
    return request;
  },
  (error) => error
);
