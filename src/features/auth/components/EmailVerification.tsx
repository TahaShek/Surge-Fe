/**
 * Email Verification Page
 * Handles verifying user's email when clicking the link sent to their inbox
 */

import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { authApi } from "@/features/auth/authapi";



type VerificationStatus = "loading" | "success" | "error";

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const navigate = useNavigate();
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    // Guard to prevent double-invocation in React 18 Strict Mode (dev only)
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    const runVerification = async () => {
      if (!token) {
        setStatus("error");
        return;
      }
      try {
        await authApi.verifyEmail(token);
        setStatus("success");
        // Optional: Redirect after delay
        // setTimeout(() => navigate("/auth/login"), 3000);
      } catch (error) {
        console.error("Email verification failed:", error);
        setStatus("error");
      }
    };
    void runVerification();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <Card className="max-w-md w-full shadow-lg border border-gray-200 rounded-3xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            {status === "loading" && (
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle className="h-12 w-12 text-green-500" />
            )}
            {status === "error" && (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
          </div>

          <CardTitle className="text-2xl font-bold">
            {status === "loading" && "Verifying your email..."}
            {status === "success" && "Email verified successfully!"}
            {status === "error" && "Verification failed"}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          {status === "loading" && (
            <p className="text-gray-600">
              Please wait while we verify your email address.
            </p>
          )}

          {status === "success" && (
            <>
              <p className="text-gray-600">
                Your email has been successfully verified. Redirecting you to
                login...
              </p>
              <Button
                onClick={() => navigate("/auth/login")}
                className="mt-3 w-full"
              >
                Go to Login
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <p className="text-gray-600">
                The verification link may have expired or is invalid.
              </p>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => navigate("/auth/resend-verification")}
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Resend Verification Email
                </Button>

                <Link
                  to="/auth/login"
                  className={cn(
                    "block text-sm text-primary font-semibold hover:underline"
                  )}
                >
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
