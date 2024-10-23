import axios, { AxiosInstance } from "axios";
import { clearTokens, getTokens, storeTokens } from "../../utils/utilTokens";
// const api: AxiosInstance = axios.create({
//   baseURL: 'http://10.0.2.2:7265/api/v1/',
// });
// const api: AxiosInstance = axios.create({
//   baseURL: 'https://192.168.1.5:8080/api/v1/',
// });
const api: AxiosInstance = axios.create({
  baseURL: "https://brokerdevapp.azurewebsites.net/api/v1/",
});
//url test
// const api: AxiosInstance = axios.create({
//   baseURL: "https://brokerappprod.azurewebsites.net/api/v1/",
// });
api.interceptors.request.use(
  async (config) => {
    const { accessToken } = await getTokens();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { refreshToken } = await getTokens(); // Implement your logic to get the refresh token
      if (refreshToken) {
        try {
          const response = await axios.post(
            "https://your-api-url.com/refresh",
            {
              refreshToken,
            }
          );
          const newAccessToken = response.data.accessToken;
          clearTokens();
          storeTokens(
            newAccessToken,
            response.data.refreshToken,
            response.data.getStreamAccessToken
          ); // Implement your logic to store the new access token
          return api(originalRequest);
        } catch (error) {
          // Handle refresh token failure
          clearTokens();
          // logoutUser(); // Implement your logic to log out the user
        }
      } else {
        clearTokens();
        //logoutUser();
      }
    }
    return Promise.reject(error);
  }
);
// Add a response interceptor to handle token refresh if needed
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const { refreshToken } = await getTokens();
      // Perform token refresh logic here and update the access token in AsyncStorage
      // Then retry the original request
      // You may also need to handle token expiration scenarios
    }
    return Promise.reject(error);
  }
);
export default api;
