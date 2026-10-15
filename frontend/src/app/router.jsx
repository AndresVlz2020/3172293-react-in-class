// src/app/router.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout } from "@/shared";
import { DashboardLayout} from "@/shared";
import { UserListPage, UserRegisterForm } from "@/features/users";
import { HomePage } from "@/features/home";
// import DeleteCounter from "@/shared/components/DeleteCounter";



const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
  },
  {
    path: "/Auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <UserRegisterForm /> },
      { path: "auth", element: <Navigate to="/dashboard" replace /> },
      { path: "userList", element: <UserListPage /> },
    ],
  },
]);

export default router;
