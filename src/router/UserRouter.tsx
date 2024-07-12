import React from "react";
import { Route, Routes } from "react-router-dom";
import { Homepage } from "../pages/user/Homepage";
import { Signup } from "../pages/user/Signup";
import { Login } from "../pages/user/Login";
import { Otp } from "../pages/user/Otp";
import { MainHome } from "../pages/user/MainHome";
import ProtectedRoute from "../components/protectedRoute/ProtectedRoute";
import PublicRoute from "../components/protectedRoute/PublicRoute";
import UserLayout from "../components/common/user/UserLayout";
import Discover from "../components/user/mainhome/Discover";
import { ForgotPassWord } from "../pages/user/ForgotPassWord";

export const UserRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route
        path="/signup"
        element={<PublicRoute element={<Signup />} redirectTo="/" />}
      />
      <Route
        path="/login"
        element={<PublicRoute element={<Login />} redirectTo="/" />}
      />
      <Route
        path="/otp"
        element={<PublicRoute element={<Otp />} redirectTo="/" />}
      />
      <Route
        path="/forgot"
        element={<PublicRoute element={<ForgotPassWord />} redirectTo="/" />}
      />

      {/* Routes that should have the sidebar layout */}
      <Route element={<ProtectedRoute element={<UserLayout />} />}>
        <Route path="/home" element={<MainHome />} />
        <Route path="/discover" element={<Discover />} />
        {/* <Route path="/friends" element={<Friends />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/zepchats" element={<ZepChats />} />
        <Route path="/support" element={<Support />} /> */}
      </Route>
    </Routes>
  );
};
