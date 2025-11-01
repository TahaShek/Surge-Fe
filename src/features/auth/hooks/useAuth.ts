/**
 * useAuth Hook
 * Custom hook for accessing auth functionality
 */

import { useAuthStore } from '../store';

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const tokens = useAuthStore((state) => state.tokens);
  const status = useAuthStore((state) => state.status);
  const error = useAuthStore((state) => state.error);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  
  const login = useAuthStore((state) => state.login);
  const signup = useAuthStore((state) => state.signup);
  const logout = useAuthStore((state) => state.logout);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const getCurrentUser = useAuthStore((state) => state.getCurrentUser);
  const clearError = useAuthStore((state) => state.clearError);

  return {
    // State
    user,
    tokens,
    status,
    error,
    isAuthenticated,
    isLoading,
    
    // Actions
    login,
    signup,
    logout,
    refreshToken,
    getCurrentUser,
    clearError,
  };
};

