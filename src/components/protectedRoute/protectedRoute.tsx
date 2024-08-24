import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const userInfo = useSelector((state: RootState) => state.userInfo.userInfo);

  return userInfo ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;