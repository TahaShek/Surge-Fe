/**
 * Reset Password Page
 * Full-page responsive login with modern design
 */

import { AuthLayout } from "../components/AuthLayout";
import { ResetPasswordForm } from "../components/ResetPasswordForm";

export const ResetPasswordPage = () => {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your Registered Email"
    >   
        <ResetPasswordForm />
    </AuthLayout>
  );
};