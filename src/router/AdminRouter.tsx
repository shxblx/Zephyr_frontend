import React from "react";
import { Route, Router, Routes } from "react-router-dom";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLayout from "../components/common/admin/AdminLayout";
import AdminUsers from "../pages/admin/AdminUsers";

export const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/users" element={<AdminUsers/>} />
        {/* <Route path="/communities" element={<AdminCommunities />} />
        <Route path="/reports" element={<AdminReports />} />
        <Route path="/support" element={<AdminSupport />} /> */}
      </Route>
    </Routes>
  );
};
