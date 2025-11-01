import { AuthLayout } from "../components/AuthLayout";
import { OtpForm } from "../components/OtpForm";

export const OtpPage = () => (
  <AuthLayout
    title="Verify your account"
    subtitle="Enter the OTP sent to your email"
  >
    <OtpForm />
  </AuthLayout>
);
