/**
 * Auth API Service
 * Handles all authentication-related API calls
 */

import { axios, TokenStorage } from '@/lib/axios';
import type {
  IAuthResponse,
  ILoginRequest,
  ISignupRequest,
  IUser,
  IRefreshTokenResponse,
} from './types';

/**
 * Auth API Endpoints
 */
const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/register',
  LOGOUT: '/auth/logout',
  LOGOUT_ALL: '/auth/logout-all',
  REFRESH: '/auth/refresh-token',
  ME: '/auth/me',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  LOGIN_WITH_OTP: '/auth/login-with-otp',
  VERIFY_OTP: '/auth/verify-otp',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification',
} as const;

/**
 * Auth API Service Class
 */
class AuthApiService {
  /**
   * Register new user
   */
  async signup(credentials: ISignupRequest): Promise<IAuthResponse> {
    const response = await axios.post<IAuthResponse>(
      AUTH_ENDPOINTS.SIGNUP,
      credentials
    );
    return response.data;
  }

  /**
   * Login user with email and password
   */
  async login(credentials: ILoginRequest): Promise<IAuthResponse> {
    const response = await axios.post<IAuthResponse>(
      AUTH_ENDPOINTS.LOGIN,
      credentials
    );
    
    // Store tokens consistently
    if (response.data.success && response.data.data) {
      const data = response.data.data as any;
      // Handle nested structure: data can have user and tokens, or tokens directly
      const tokens = data.tokens || data;
      if (tokens && tokens.accessToken && tokens.refreshToken) {
        TokenStorage.setTokens({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
        // Backward compatibility with legacy keys
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
      }
    }
    
    return response.data;
  }

  /**
   * Request OTP for login
   */
  async loginWithOtp(email: string): Promise<{ message: string }> {
    const response = await axios.post<{ message: string }>(
      AUTH_ENDPOINTS.LOGIN_WITH_OTP,
      { email }
    );
    return response.data;
  }

  /**
   * Verify OTP and login
   */
  async verifyOtp(email: string, otp: string): Promise<IAuthResponse> {
    const response = await axios.post<IAuthResponse>(
      AUTH_ENDPOINTS.VERIFY_OTP,
      { email, otp }
    );

    // Store tokens consistently
    if (response.data.success && response.data.data) {
      const data = response.data.data as any;
      const tokens = data.tokens || data;
      if (tokens && tokens.accessToken && tokens.refreshToken) {
        TokenStorage.setTokens({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
        // Backward compatibility with legacy keys
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
      }
    }

    return response.data;
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await axios.get<{ message: string }>(
      `${AUTH_ENDPOINTS.VERIFY_EMAIL}?token=${token}`
    );
    return response.data;
  }

  /**
   * Resend verification email
   */
  async resendVerification(email: string): Promise<{ message: string }> {
    const response = await axios.post<{ message: string }>(
      AUTH_ENDPOINTS.RESEND_VERIFICATION,
       email 
    );
    return response.data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await axios.post(AUTH_ENDPOINTS.LOGOUT);
    } finally {
      // Clear tokens regardless of API call success
      TokenStorage.clearTokens();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  /**
   * Logout from all devices
   */
  async logoutAll(): Promise<void> {
    try {
      await axios.post(AUTH_ENDPOINTS.LOGOUT_ALL);
    } finally {
      // Clear tokens regardless of API call success
      TokenStorage.clearTokens();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const response = await axios.post<IRefreshTokenResponse>(
      AUTH_ENDPOINTS.REFRESH, 
      { refreshToken }
    );

    const tokens = response.data.data.tokens;
    
    // Update stored tokens
    TokenStorage.setTokens({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
    // Backward compatibility with legacy keys
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);

    return tokens;
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<IUser> {
    const response = await axios.get<IAuthResponse>(AUTH_ENDPOINTS.ME);
    if (response.data.success && response.data.data) {
      return response.data.data as IUser;
    }
    throw new Error('Failed to get current user');
  }

  /**
   * Forgot password - request reset link
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await axios.post<{ message: string }>(
      AUTH_ENDPOINTS.FORGOT_PASSWORD,
      { email }
    );
    return response.data;
  }

  /**
   * Reset password with token
   */
  async resetPassword(
    token: string,
    password: string
  ): Promise<{ message: string }> {
    const response = await axios.post<{ message: string }>(
      AUTH_ENDPOINTS.RESET_PASSWORD,
      { token, password }
    );
    return response.data;
  }
}

// Export singleton instance
export const authApi = new AuthApiService();

// Export class for testing
export default AuthApiService;
