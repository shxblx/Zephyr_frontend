import React from "react";
import { Route, Router, Routes } from "react-router-dom";
import AdminLogin from "../pages/admin/AdminLogin";

export const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
    </Routes>
  );
};
