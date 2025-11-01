/**
 * Forgot Password Page
 * Full-page responsive login with modern design
 */

import { AuthLayout } from "../components/AuthLayout";
import { ForgotPasswordForm } from "../components/ForgotPaasswordForm";

export const ForgotPasswordPage = () => {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your Registered Email"
    >   
        <ForgotPasswordForm />
    </AuthLayout>
  );
};