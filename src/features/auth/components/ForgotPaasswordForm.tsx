/**
 * Forgot Password Form Component
 * - Simple email-only form
 * - Uses react-hook-form with Zod validation
 * - Submits email to backend for password reset / OTP
 */

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { Mail, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/form";
import { useAuthStore } from "../store";
import { authApi } from "../authapi";
import { forgotPasswordSchema } from "../authschema";
import { toast } from "sonner";


export const ForgotPasswordForm = () => {
  const isLoading = useAuthStore((state) => state.isLoading);

  const methods = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await authApi.forgotPassword(data.email);
      // Optional: navigate to OTP or confirmation page
      toast.success("A reset link or OTP has been sent to your email.");
    } catch (err) {
      console.error("Forgot password error:", err);
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
            icon={<Mail className="h-4 w-4 text-gray-400" />}
            autoComplete="email"
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Send Reset Link
              </>
            )}
          </Button>
        </form>
      </FormProvider>

      {/* Back to Login */}
      <div className="mt-6 text-center">
        <p className="text-base text-gray-600 dark:text-gray-400">
          Remembered your password?{" "}
          <Link
            to= "/auth/login"
            className="font-semibold text-primary hover:underline underline-offset-2"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
