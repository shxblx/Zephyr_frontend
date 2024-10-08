import React from "react";
import { Route, Routes } from "react-router-dom";
import { Homepage } from "../pages/user/Homepage";
import { Signup } from "../pages/user/Signup";
import { Login } from "../pages/user/Login";
import { Otp } from "../pages/user/Otp";
import { MainHome } from "../pages/user/MainHome";
import Protectedroute from "../components/common/user/Protectedroute";
import PublicRoute from "../components/protectedRoute/PublicRoute";
import UserLayout from "../components/common/user/UserLayout";
import { ForgotPassWord } from "../pages/user/ForgotPassWord";
import { UserProfile } from "../pages/user/UserProfile";
import { ProfileSettings } from "../pages/user/ProfileSettings";
import FindFriends from "../pages/user/FindFriends";
import MyFriends from "../pages/user/Friends/MyFriends";
import ZepChats from "../pages/user/zepchats/Zepchats";
import ZepChatView from "../pages/user/zepchats/ZepChatView";
import MyCommunities from "../pages/user/community/MyCommunties";
import Support from "../pages/user/support/Support";

export const UserRouter: React.FC = () => {
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

      <Route element={<Protectedroute element={<UserLayout />} />}>
        <Route path="/home" element={<MainHome />} />
        <Route path="/findfriends" element={<FindFriends />} />
        <Route path="/friends" element={<MyFriends />} />
        <Route path="/communities" element={<MyCommunities />} />
        <Route path="/zepchats" element={<ZepChats />} />
        <Route path="/zepchats/:id" element={<ZepChatView />} />
        <Route path="/support" element={<Support />} />
      </Route>

      <Route
        path="/profile"
        element={<Protectedroute element={<UserProfile />} />}
      />
      <Route
        path="/profile/settings"
        element={<Protectedroute element={<ProfileSettings />} />}
      />
    </Routes>
  );
};

export default UserRouter;
