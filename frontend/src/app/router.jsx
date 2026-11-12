// src/app/router.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardLayout, ProtectedRoute } from "@/shared";
import { UserListPage, UserRegisterForm, UserEditPage } from "@/features/users";
import { HomePage } from "@/features/home";
import { Login } from "@/features/auth";
import { AccessPage } from "@/features/access";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth" replace />,
  },
  {
    path: "/auth",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/inicio",
    element: <Navigate to="/home" replace />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute requiredPermission="create_user">
            <UserRegisterForm />
          </ProtectedRoute>
        ),
      },
      { path: "home", element: <Navigate to="/home" replace /> },
      { path: "auth", element: <Navigate to="/dashboard" replace /> },
      {
        path: "userList",
        element: (
          <ProtectedRoute requiredPermission="list_user">
            <UserListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "access",
        element: (
          <ProtectedRoute requiredPermission="admin">
            <AccessPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/:id/edit",
        element: (
          <ProtectedRoute>
            <UserEditPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/users/:id/edit",
    element: <Navigate to="/dashboard/userList" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/auth" replace />,
  },
]);

export default router;
