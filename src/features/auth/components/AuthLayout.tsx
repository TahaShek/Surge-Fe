/**
 * Auth Layout Component
 * Responsive layout wrapper for authentication pages
 */

import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Shield } from 'lucide-react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <div className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                <Shield className="h-8 w-8 text-primary dark:text-primary/90" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">YourApp</span>
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 sm:p-12 border border-gray-200 dark:border-gray-700">
            <div className="mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{title}</h2>
              <p className="mt-3 text-base text-gray-600 dark:text-gray-400">{subtitle}</p>
            </div>

            {children}
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center space-x-8 text-sm text-gray-600 dark:text-gray-400">
            <Link to="/help" className="hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
              Help
            </Link>
            <Link to="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

