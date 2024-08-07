// src/routes/AdminRouter.tsx

import { Route, Routes } from "react-router-dom";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLayout from "../components/common/admin/AdminLayout";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminCommunities from "../pages/admin/AdminCommunities";
import AdminProtectedRoute from "../components/protectedRoute/AdminProtectedRoute";
import AdminReports from "../pages/admin/AdminReports";
import AdminUserDetails from "../pages/admin/AdminUserDetails";

export const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route
          path="/dashboard"
          element={<AdminProtectedRoute element={<AdminDashboard />} />}
        />
        <Route
          path="/users"
          element={<AdminProtectedRoute element={<AdminUsers />} />}
        />
        <Route
          path="/users/:userId"
          element={<AdminProtectedRoute element={<AdminUserDetails />} />}
        />
        <Route
          path="/communities"
          element={<AdminProtectedRoute element={<AdminCommunities />} />}
        />
        <Route
          path="/reports"
          element={<AdminProtectedRoute element={<AdminReports />} />}
        />
      </Route>
    </Routes>
  );
};
