/**
 * Check Email Page
 * Shown after successful registration to remind user to check their email
 */

import { useLocation, useNavigate, Link } from "react-router";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { authApi } from "../authapi";

export const CheckEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const email = location.state?.email || "";
  const message = location.state?.message || "Please check your email to verify your account";

  const handleResendEmail = async () => {
    if (!email) return;
    
    setIsResending(true);
    setResendMessage("");
    
    try {
      await authApi.resendVerification({ email });
      setResendMessage("Verification email sent! Please check your inbox.");
    } catch (error: any) {
      setResendMessage(error.response?.data?.message || "Failed to resend email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Check Your Email</h1>
          <p className="text-gray-600">{message}</p>
        </div>

        {/* Email Display */}
        {email && (
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">We sent a verification link to:</p>
            <p className="font-semibold text-gray-900">{email}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="space-y-3 text-sm text-gray-600">
          <p className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">1.</span>
            <span>Check your inbox for an email from Nexus Backend</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">2.</span>
            <span>Click the verification link in the email</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">3.</span>
            <span>You'll be redirected to login</span>
          </p>
        </div>

        {/* Resend Message */}
        {resendMessage && (
          <div className={`p-3 rounded-md ${
            resendMessage.includes("sent") 
              ? "bg-green-50 border border-green-200" 
              : "bg-red-50 border border-red-200"
          }`}>
            <p className={`text-sm ${
              resendMessage.includes("sent") ? "text-green-600" : "text-red-600"
            }`}>
              {resendMessage}
            </p>
          </div>
        )}

        {/* Resend Button */}
        <div className="space-y-3">
          <p className="text-sm text-gray-500 text-center">
            Didn't receive the email?
          </p>
          <Button
            onClick={handleResendEmail}
            disabled={isResending || !email}
            variant="outline"
            className="w-full"
          >
            {isResending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Resending...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend Verification Email
              </>
            )}
          </Button>
        </div>

        {/* Back to Login */}
        <div className="pt-4 border-t">
          <Link to="/auth/login">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </Link>
        </div>

        {/* Note */}
        <p className="text-xs text-gray-500 text-center pt-2">
          Note: The verification link will expire in 24 hours
        </p>
      </Card>
    </div>
  );
};

