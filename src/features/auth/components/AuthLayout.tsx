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
      {/* Left Side - Branding & Info (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-12 text-white flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}

        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Shield className="h-8 w-8" />
            </div>
            <span className="text-2xl font-bold">YourApp</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Welcome to the future of productivity
          </h1>
          <p className="text-lg text-white/90">
            Join thousands of users who trust us with their workflow. Experience
            seamless collaboration and powerful features.
          </p>

          {/* Features */}
          <div className="space-y-4 pt-8">
            {[
              'Secure authentication',
              'Real-time collaboration',
              'Advanced analytics',
              '24/7 support',
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-sm text-white/70">
          © 2025 YourApp. All rights reserved.
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <span className="text-2xl font-bold text-gray-900">YourApp</span>
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 sm:p-12 border border-gray-200">
            <div className="mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{title}</h2>
              <p className="mt-3 text-base text-gray-600">{subtitle}</p>
            </div>

            {children}
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center space-x-8 text-sm text-gray-600">
            <Link to="/help" className="hover:text-gray-900 transition-colors font-medium">
              Help
            </Link>
            <Link to="/privacy" className="hover:text-gray-900 transition-colors font-medium">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-gray-900 transition-colors font-medium">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

