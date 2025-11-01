import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { MainLayout } from "@/features/layout";
import { UserFormTabs } from "@/features/user-form/UserFormTabs";
import { 
  LoginPage, 
  SignupPage, 
  CheckEmailPage,
  EmailVerificationPage,
  OtpPage,
  ProtectedRoute 
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
        path: "users",
        element: (
          <PermissionGuard subject="Hello">
            <div>
              <h1 className="text-3xl font-bold">Users</h1>
              <p className="text-muted-foreground mt-2">
                Users list coming soon...
              </p>
            </div>
          </PermissionGuard>
        ),
      },
      {
        path: "jobs",
        element: (
          <JobsPage />
        ),
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
        path: "user-form",
        element: (
          <PermissionGuard subject="UserForm">
            <UserFormTabs />
          </PermissionGuard>
        ),
      },
      {
        path: "user-form/:id",
        element: (
          <PermissionGuard subject="UserForm">
            <UserFormTabs userId="123" />
          </PermissionGuard>
        ),
      },
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
        element: (
            <NotificationApiDemo />
        ),
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

