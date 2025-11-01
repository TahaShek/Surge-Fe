/**
 * Axios Interceptors
 * Request and Response interceptors with error handling, retry logic, and token management
 */

import axios from 'axios';
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { axiosInstance } from './axios.config';

// Extend InternalAxiosRequestConfig to include metadata
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
  }
}

// Token storage keys
const TOKEN_STORAGE_KEY = 'auth_tokens';

// Track if we're currently refreshing token to prevent multiple refresh calls
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

/**
 * Token Storage Utilities
 */
export const TokenStorage = {
  getTokens: () => {
    try {
      const tokens = localStorage.getItem(TOKEN_STORAGE_KEY);
      return tokens ? JSON.parse(tokens) : null;
    } catch {
      return null;
    }
  },

  setTokens: (tokens: { accessToken: string; refreshToken: string }) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  },

  clearTokens: () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  },

  getAccessToken: () => {
    const tokens = TokenStorage.getTokens();
    return tokens?.accessToken || null;
  },

  getRefreshToken: () => {
    const tokens = TokenStorage.getTokens();
    return tokens?.refreshToken || null;
  },
};

/**
 * Subscribe to token refresh
 */
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

/**
 * Notify all subscribers when token is refreshed
 */
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

/**
 * Request Interceptor
 * Adds authentication token and custom headers
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add access token to request headers
    const accessToken = TokenStorage.getAccessToken();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };

    // Log request in development
    if (import.meta.env.DEV) {
      console.log('🚀 Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles success responses and error responses with retry logic
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      const startTime = response.config.metadata?.startTime;
      const duration = startTime
        ? new Date().getTime() - new Date(startTime).getTime()
        : 0;
      console.log('✅ Response:', {
        method: response.config.method?.toUpperCase(),
        url: response.config.url,
        status: response.status,
        duration: `${duration}ms`,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Log error in development
    if (import.meta.env.DEV) {
      console.error('❌ Response Error:', {
        method: originalRequest?.method?.toUpperCase(),
        url: originalRequest?.url,
        status: error.response?.status,
        message: error.message,
      });
    }

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = TokenStorage.getRefreshToken();

          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          // Call refresh token endpoint
          const response = await axios.post(
            `${axiosInstance.defaults.baseURL}/auth/refresh`,
            { refreshToken }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          // Store new tokens
          TokenStorage.setTokens({
            accessToken,
            refreshToken: newRefreshToken,
          });

          // Notify all subscribers
          onTokenRefreshed(accessToken);

          // Update original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          isRefreshing = false;

          // Retry original request
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];

          // Clear tokens and redirect to login
          TokenStorage.clearTokens();
          
          // Dispatch logout event
          window.dispatchEvent(new CustomEvent('auth:logout'));

          return Promise.reject(refreshError);
        }
      }

      // If already refreshing, wait for new token
      return new Promise((resolve) => {
        subscribeTokenRefresh((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    // Transform error to standard format
    const transformedError = transformAxiosError(error);
    return Promise.reject(transformedError);
  }
);

/**
 * Transform Axios Error to standard error format
 */
const transformAxiosError = (error: AxiosError): ITransformedError => {
  if (error.response) {
    // Server responded with error
    const status = error.response.status;
    const data = error.response.data as Record<string, unknown>;
    const message = typeof data?.message === 'string' 
      ? data.message 
      : error.message || 'An error occurred';

    return {
      // code: getErrorCode(status),
      message,
      status,
      details: data,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      // code: AuthErrorCode.NETWORK_ERROR,
      message: 'Network error. Please check your connection.',
      status: 0,
      details: error.request,
    };
  } else {
    // Error in request setup
    return {
      // code: AuthErrorCode.UNKNOWN_ERROR,
      message: error.message || 'An unknown error occurred',
      status: 0,
      details: null,
    };
  }
};

/**
 * Get error code from HTTP status
 */
// const getErrorCode = (status: number): AuthErrorCode => {
//   switch (status) {
//     case 401:
//       return AuthErrorCode.UNAUTHORIZED;
//     case 403:
//       return AuthErrorCode.UNAUTHORIZED;
//     case 400:
//       return AuthErrorCode.VALIDATION_ERROR;
//     case 409:
//       return AuthErrorCode.USER_ALREADY_EXISTS;
//     default:
//       return AuthErrorCode.UNKNOWN_ERROR;
//   }
// };

/**
 * Transformed Error Interface
 */
export interface ITransformedError {
  // code: AuthErrorCode;
  message: string;
  status: number;
  details: unknown;
}

/**
 * Setup interceptors (called on app initialization)
 */
export const setupAxiosInterceptors = () => {
  console.log('✅ Axios interceptors initialized');
};

// Export axios instance
export { axiosInstance };

