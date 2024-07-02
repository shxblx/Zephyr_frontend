import React from "react";
import { Route, Routes } from "react-router-dom";
import { Homepage } from "../pages/user/Homepage";
import { Signup } from "../pages/user/Signup";
import { Login } from "../pages/user/Login";
import { Otp } from "../pages/user/Otp";
import { MainHome } from "../pages/user/MainHome";
import ProtectedRoute from "../components/protectedRoute/protectedRoute";
import PublicRoute from "../components/protectedRoute/PublicRoute";

export const UserRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route
        path="/signup"
        element={<PublicRoute element={<Signup />} redirectTo="/home" />}
      />
      <Route
        path="/login"
        element={<PublicRoute element={<Login />} redirectTo="/home" />}
      />
      <Route
        path="/otp"
        element={<PublicRoute element={<Otp />} redirectTo="/home" />}
      />
      <Route path="/home" element={<ProtectedRoute element={<MainHome />} />} />
    </Routes>
  );
};
