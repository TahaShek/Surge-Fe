/**
 * Login Page
 * Full-page responsive login with modern design
 */

import { LoginForm } from "../components/LoginForm";
import { AuthLayout } from "../components/AuthLayout";

export const LoginPage = () => {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <LoginForm />
    </AuthLayout>
  );
};
