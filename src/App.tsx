import { useEffect, useState } from 'react';
import { AbilityProvider } from './features/authorization';
import { ThemeProvider } from './contexts/ThemeContext';
import { SocketProvider } from './features/realtime/context/SocketProvider';
import { AppRoutes } from './app/routes/AppRoutes';
import { Toaster } from '@/components/ui/sonner';
import { useAuthStore } from './features/auth';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // Check authentication status on app load
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsCheckingAuth(false);
    };
    
    initAuth();
  }, [checkAuth]);

  // Show loading screen while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center  ">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    // <AbilityProvider>
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <SocketProvider>
          <AppRoutes />
          <Toaster richColors closeButton position="top-right" />
        </SocketProvider>
      </ThemeProvider>
    // </AbilityProvider>
  );
}