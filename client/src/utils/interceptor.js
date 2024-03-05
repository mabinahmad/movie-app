import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_USERS,
});

// Intercept responses to handle token expiration and refresh
axiosInstance.interceptors.response.use(
  // On successful response, pass through the response
  (response) => response,
  // On error response, handle unauthorized (401) errors
  async (error) => {
    if (error.response.status === 401) {
      // If the error is due to unauthorized access, attempt to refresh the token
      const response = await axiosInstance("/refresh-token");
      // Update the token in the local storage with the new access token
      localStorage.setItem("token", response.data.accessToken);

      // Reload the window to apply the updated token
      window.location.reload();
    }
    // Reject the error to propagate it to the caller
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("token");
    if (token) {
      request.withCredentials = true;
      request.headers.Authorization = token;
    }
    return request;
  },
  (error) => error
);
