import { useLocalStorage } from "../AppCore/services/LocalStorageService"

// Store tokens after login
 export const  storeTokens = async (accessToken:any, refreshToken:any,getStreamAccessToken:any) => {
  await window.localStorage.setItem('access_token', accessToken);
  await window.localStorage.setItem('refresh_token', refreshToken);
  await window.localStorage.setItem('getStreamAccessToken', getStreamAccessToken);
};

// Retrieve tokens
export const getTokens = async () => {
  const accessToken = await window.localStorage.getItem('access_token');
  const refreshToken = await window.localStorage.getItem('refresh_token');
  const getStreamAccessToken = await window.localStorage.getItem('getStreamAccessToken');
  return { accessToken, refreshToken,getStreamAccessToken };
};

// Clear tokens on logout
export const clearTokens = async () => {
  await window.localStorage.removeItem('access_token');
  await window.localStorage.removeItem('refresh_token');
  await window.localStorage.removeItem('getStreamAccessToken');
};

