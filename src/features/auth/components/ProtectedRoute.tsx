/**
 * Protected Route Component
 * Wrapper component to protect routes that require authentication
 */

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuthStore } from '../store';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  requireAuth = true,
  redirectTo = '/auth/login',
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, getCurrentUser, user } = useAuthStore();

  useEffect(() => {
    // Try to get current user if not loaded
    if (!user && !isLoading && isAuthenticated) {
      getCurrentUser().catch(() => {
        // Handle error silently, will redirect to login
        // g ap toh cake nikly
      });
    }
  }, [user, isLoading, isAuthenticated, getCurrentUser]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Redirect authenticated users away from auth pages
  if (!requireAuth && isAuthenticated) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

