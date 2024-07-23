import { Route, Routes } from "react-router-dom";
import { Homepage } from "../pages/user/Homepage";
import { Signup } from "../pages/user/Signup";
import { Login } from "../pages/user/Login";
import { Otp } from "../pages/user/Otp";
import { MainHome } from "../pages/user/MainHome";
import ProtectedRoute from "../components/protectedRoute/ProtectedRoute";
import PublicRoute from "../components/protectedRoute/PublicRoute";
import UserLayout from "../components/common/user/UserLayout";
import { ForgotPassWord } from "../pages/user/ForgotPassWord";
import { UserProfile } from "../pages/user/UserProfile";
import { ProfileSettings } from "../pages/user/ProfileSettings";
import FindFriends from "../pages/user/Friends/FindFriends";
import MyFriends from "../pages/user/Friends/MyFriends";
import MyCommunties from "../pages/user/community/MyCommunties";
import CreateCommunity from "../pages/user/community/CreateCommunity";

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

      <Route element={<ProtectedRoute element={<UserLayout />} />}>
        <Route path="/home" element={<MainHome />} />
        <Route path="/findfriends" element={<FindFriends />} />
        <Route path="/friends" element={<MyFriends />} />
        <Route path="/communities" element={<MyCommunties />} />
      </Route>

      <Route
        path="/profile"
        element={<ProtectedRoute element={<UserProfile />} />}
      />
      <Route
        path="/profile/settings"
        element={<ProtectedRoute element={<ProfileSettings />} />}
      />
    </Routes>
  );
};
