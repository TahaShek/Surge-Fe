/**
 * Signup Page
 * Full-page responsive signup with modern design
 */

import { SignupForm } from "../components/SignupForm";
import { AuthLayout } from "../components/AuthLayout";

export const SignupPage = () => {
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Get started with your free account today"
    >
      <SignupForm />
    </AuthLayout>
  );
};
