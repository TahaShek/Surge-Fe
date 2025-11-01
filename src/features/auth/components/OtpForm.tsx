/**
 * OTP Verification Form
 * Built using Shadcn-style InputOTP components and React Hook Form
 */

import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { authApi } from "../authapi";
import { useAuthStore } from "../store";

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "Only numbers are allowed"),
});

type OtpFormData = z.infer<typeof otpSchema>;

export const OtpForm = () => {
  const methods = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();
  const getCurrentUser = useAuthStore((s) => s.getCurrentUser);
  const otpValue = watch("otp");

  const onSubmit = handleSubmit(async (data) => {
    if (!email) return;
    setIsLoading(true);
    setOtpError(null);
    try {
      await authApi.verifyOtp(email, data.otp);
      await getCurrentUser();
      navigate("/dashboard");
    } catch (error: any) {
      console.error("❌ OTP verification failed:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Invalid OTP. Please try again.';
      setOtpError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="w-full">
      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Label */}
          <div className="space-y-2 text-center">
            <Label
              htmlFor="otp"
              className="text-sm font-semibold text-gray-600 dark:text-gray-400"
            >
              Enter the 6-digit code sent to your email
            </Label>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={(val) => setValue("otp", val)}
            >
              <InputOTPGroup>
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Validation Error */}
          {errors.otp && (
            <p className="text-sm text-red-500 text-center mt-2">
              {errors.otp.message}
            </p>
          )}

          {/* API Error Message */}
          {otpError && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600 text-center">{otpError}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-5 w-5" />
                Verify OTP
              </>
            )}
          </Button>

          {/* Resend Option */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={async () => {
                if (!email) return;
                try {
                  await authApi.loginWithOtp(email);
                } catch (e) {
                  console.error(e);
                }
              }}
              className="text-sm text-primary font-semibold hover:underline underline-offset-2"
            >
              Didn’t get the code? Resend
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
