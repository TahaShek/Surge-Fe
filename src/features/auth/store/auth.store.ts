import { create } from 'zustand';
import { TokenStorage } from '@/lib/axios';
import type { IUser, ILoginRequest, ISignupRequest } from '../types/auth.types';
import { authApi } from '../authapi';

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface IAuthStore {
  isAuthenticated: boolean;
  user: IUser | null;
  isLoading: boolean;
  error: { message: string } | null;
  tokens: { accessToken: string; refreshToken: string } | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  setUser: (user: IUser) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  login: (credentials: ILoginRequest) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  getCurrentUser: () => Promise<IUser | null>;
  refreshToken: (refreshToken: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
  tokens: null,
  status: 'idle',
  
  setUser: (user) => set({ user, isAuthenticated: true, error: null, status: 'authenticated' }),
  
  setIsAuthenticated: (isAuthenticated) => set({ 
    isAuthenticated, 
    status: isAuthenticated ? 'authenticated' : 'unauthenticated' 
  }),
  
  clearError: () => set({ error: null }),
  
  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null, status: 'loading' });
      const response = await authApi.login(credentials);
      
      if (response.success && response.data) {
        const userData = (response.data as any).user || response.data;
        
        // Store user in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(userData));
        
        set({ 
          user: userData as IUser, 
          isAuthenticated: true, 
          isLoading: false,
          error: null,
          status: 'authenticated'
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      set({ 
        error: { message: errorMessage }, 
        isLoading: false,
        status: 'unauthenticated'
      });
      throw error;
    }
  },
  
  signup: async (data: SignupData) => {
    try {
      set({ isLoading: true, error: null });
      
      // Transform firstName + lastName to name
      const signupData: ISignupRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      };
      
      const response = await authApi.signup(signupData);
      
      if (response.success) {
        // Don't auto-login after signup, user needs to verify email
        set({ 
          isLoading: false,
          error: null 
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Signup failed';
      set({ 
        error: { message: errorMessage }, 
        isLoading: false 
      });
      throw error;
    }
  },
  
  logout: async () => {
    try {
      set({ isLoading: true });
      await authApi.logout();
      TokenStorage.clearTokens();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: null, 
        tokens: null,
        status: 'unauthenticated'
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Logout failed';
      set({ 
        error: { message: errorMessage },
        isLoading: false 
      });
    }
  },
  
  checkAuth: async () => {
    try {
      const token = localStorage.getItem('accessToken') || TokenStorage.getAccessToken();
      const storedUser = localStorage.getItem('user');
      
      if (!token) {
        set({ isAuthenticated: false, user: null, status: 'unauthenticated' });
        return;
      }
      
      // Use stored user first for instant auth, then fetch fresh data
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          set({ user, isAuthenticated: true, error: null, status: 'authenticated' });
        } catch (e) {
          // Invalid stored user, fetch from backend
        }
      }
      
      // Fetch fresh user data from backend
      const user = await authApi.getCurrentUser();
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isAuthenticated: true, error: null, status: 'authenticated' });
    } catch (error) {
      set({ isAuthenticated: false, user: null, status: 'unauthenticated' });
      TokenStorage.clearTokens();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },
  
  getCurrentUser: async () => {
    try {
      const user = await authApi.getCurrentUser();
      set({ user, isAuthenticated: true, error: null, status: 'authenticated' });
      return user;
    } catch (error) {
      set({ user: null, isAuthenticated: false, status: 'unauthenticated' });
      return null;
    }
  },
  
  refreshToken: async (refreshToken: string) => {
    try {
      const tokens = await authApi.refreshToken(refreshToken);
      set({ tokens, error: null });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Token refresh failed';
      set({ 
        error: { message: errorMessage },
        isAuthenticated: false,
        user: null,
        status: 'unauthenticated',
        tokens: null
      });
      TokenStorage.clearTokens();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw error;
    }
  },
}));