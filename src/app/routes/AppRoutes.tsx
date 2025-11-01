import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { MainLayout } from "@/features/layout";
import { UserFormTabs } from "@/features/user-form/UserFormTabs";
import {
  LoginPage,
  SignupPage,
  CheckEmailPage,
  EmailVerificationPage,
  OtpPage,
  ProtectedRoute,
} from "@/features/auth";
import DashboardPage from "@/app/pages/DashboardPage";
import { PermissionGuard } from "@/features/authorization/components/PermissionGuard";
import { ChatPage } from "@/features/chat/pages/ChatPage";
import { NotificationPage } from "@/features/notifications/pages/NotificationPage";
import { NotificationApiDemo } from "@/features/notifications";
import { RealtimeDemo } from "@/features/realtime/examples/RealtimeDemo";
import { MapsPage } from "@/features/maps/pages/MapsPage";
import JobsPage from "@/features/jobs/components/jobs";
import CreateJobPage from "@/features/jobs/components/CreateJobPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPassword";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPassword";
import TalentSeekerProfileForm from "@/features/talent-seeker/components/TalentSeekerProfileForm";
import MyJobsPage from "@/features/jobs/components/MyJobs";
import EditJobPage from "@/features/jobs/components/EditJobForm";

const router = createBrowserRouter([
  // Redirect root to dashboard
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },

  // Auth routes (public)
  {
    path: "auth",
    children: [
      {
        path: "login",
        element: (
          <ProtectedRoute requireAuth={false}>
            <LoginPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <ProtectedRoute requireAuth={false}>
            <ForgotPasswordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "reset-password",
        element: (
          <ProtectedRoute requireAuth={false}>
            <ResetPasswordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SignupPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "check-email",
        element: <CheckEmailPage />,
      },
      {
        path: "verify-email",
        element: <EmailVerificationPage />,
      },
      {
        path: "otp",
        element: (
          <ProtectedRoute requireAuth={false}>
            <OtpPage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Protected routes (require authentication)
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <PermissionGuard subject="Dashboard">
            <DashboardPage />
          </PermissionGuard>
        ),
      },
      {
        path: "my-jobs",
        element: <MyJobsPage />,
      },
      {
        path: "/jobs/create",
        element: (
          // <PermissionGuard subject="Dashboard">
          <CreateJobPage />
          // </PermissionGuard>
        ),
      },
      {
        path: "jobs/edit/:jobId", // Dynamic route for editing specific job
        element: (
          // <PermissionGuard subject="Dashboard">
          <EditJobPage />
          // </PermissionGuard>
        ),
      },

      {
        path: "jobs",
        element: <JobsPage />,
      },
      {
        path: "jobs/create",
        element: (
          // <PermissionGuard subject="Dashboard">
          <CreateJobPage />
          // </PermissionGuard>
        ),
      },
      {
        path: "profile",
        element: <TalentSeekerProfileForm />,
      },
      {},
      {},
      {},
      {
        path: "chat",
        element: (
          <PermissionGuard subject="Chat">
            <ChatPage />
          </PermissionGuard>
        ),
      },
      {
        path: "notifications",
        element: (
          <PermissionGuard subject="Notifications">
            <NotificationPage />
          </PermissionGuard>
        ),
      },
      {
        path: "notifications/demo",
        element: <NotificationApiDemo />,
      },
      {
        path: "realtime-demo",
        element: (
          <PermissionGuard subject="Dashboard">
            <RealtimeDemo />
          </PermissionGuard>
        ),
      },
      {
        path: "maps",
        element: (
          <PermissionGuard subject="Maps">
            <MapsPage />
          </PermissionGuard>
        ),
      },
    ],
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};
