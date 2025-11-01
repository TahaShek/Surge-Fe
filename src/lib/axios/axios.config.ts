/**
 * Axios Configuration
 * Centralized axios instance with configuration
 */

import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

// API Configuration
// Normalize base URL to ensure it has a protocol
const normalizeBaseUrl = (url: string | undefined): string => {
  if (!url) {
    return 'http://localhost:5000/api';
  }
  
  // If URL doesn't start with http:// or https://, add http://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    // Check if it starts with // (protocol-relative), if so add http:
    if (url.startsWith('//')) {
      return `http:${url}`;
    }
    return `http://${url}`;
  }
  
  return url;
};

export const API_CONFIG = {
  BASE_URL: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL),
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Log the configured base URL in development
if (import.meta.env.DEV) {
  console.log('🔧 API Base URL:', API_CONFIG.BASE_URL);
}

// Create axios instance
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important: Send cookies with requests
});

// Request interceptor - Add auth token to requests (from cookies)
// Note: Main interceptors are in axios.interceptors.ts
// This is a fallback, tokens are in cookies and sent automatically via withCredentials
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Tokens are in cookies and sent automatically via withCredentials: true
    // This interceptor is minimal, main logic is in axios.interceptors.ts
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Refresh token is in cookie, check via TokenStorage
      // Import TokenStorage from interceptors (it's exported)
      // For now, just try refresh - backend reads from cookie
      try {
        const response = await axios.post(
          `${API_CONFIG.BASE_URL}/auth/refresh-token`,
          {}, // Backend reads refresh token from cookie
          { withCredentials: true }
        );

        // Tokens are set by backend in cookies via Set-Cookie header
        // Read access token from response or cookie
        let accessToken = null;
        if (response.data?.data?.tokens?.accessToken) {
          accessToken = response.data.data.tokens.accessToken;
        } else if (response.data?.tokens?.accessToken) {
          accessToken = response.data.tokens.accessToken;
        }

        // If access token in response, use it; otherwise backend set it in cookie
        if (accessToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          processQueue(null, accessToken);
        } else {
          // Token should be in cookie now, let the request proceed
          processQueue(null, null);
        }

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear cookies and redirect to login
        processQueue(refreshError, null);
        if (typeof document !== 'undefined') {
          document.cookie = 'accessToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
          document.cookie = 'refreshToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
        }
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Export default instance
export default axiosInstance;

