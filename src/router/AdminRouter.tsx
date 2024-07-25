import { Route, Routes } from "react-router-dom";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLayout from "../components/common/admin/AdminLayout";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminCommunities from "../pages/admin/AdminCommunities";
import AdminProtectedRoute from "../components/protectedRoute/AdminProtectedRoute";

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
          path="/communities"
          element={<AdminProtectedRoute element={<AdminCommunities />} />}
        />
      </Route>
    </Routes>
  );
};
