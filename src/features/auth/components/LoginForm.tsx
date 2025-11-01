/**
 * Login Form Component
 * Responsive login form with validation
 */

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { loginSchema } from "../authschema";
import { useAuthStore } from "../store";
import { authApi } from "../authapi";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const LoginForm = () => {
  const navigate = useNavigate();
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const methods = useForm({
    resolver: zodResolver(loginSchema),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      setLoginError(null);
      clearError();
      
      // Step 1: Authenticate with email and password
      await authApi.login({
        email: data.email,
        password: data.password,
      });
      
      // Step 2: Request OTP after successful password authentication
      await authApi.loginWithOtp(data.email);
      
      // Step 3: Navigate to OTP page for second factor authentication
      navigate(`/auth/otp?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
      setLoginError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="w-full">
      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Email Field */}
          <TextInput
            name="email"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />

          {/* Password Field with Toggle */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
                className={`h-11 pr-11 ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                id="rememberMe"
                type="checkbox"
                {...register("rememberMe")}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 cursor-pointer"
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm font-medium cursor-pointer text-gray-700"
              >
                Remember me
              </Label>
            </div>
            <Link
              to="/auth/forgot-password"
              className="text-sm font-semibold text-primary hover:underline underline-offset-2"
            >
              Forgot password?
            </Link>
          </div>

          {/* Error Message */}
          {(error || loginError) && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{loginError || error?.message}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={isLoading || isSubmitting}
          >
            {(isLoading || isSubmitting) ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
              </>
            )}
          </Button>
        </form>
      </FormProvider>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Or</span>
        </div>
      </div>

      {/* OTP Login Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full h-11"
        onClick={() => navigate("/auth/otp")}
      >
        Login with OTP
      </Button>

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <p className="text-base text-gray-700">
          Don't have an account?{" "}
          <Link
            to="/auth/signup"
            className="font-semibold text-primary hover:underline underline-offset-2"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
