import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";

interface AdminProtectedRouteProps {
  element: React.ReactElement;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  element,
}) => {
  const adminInfo = useSelector(
    (state: RootState) => state.adminInfo.adminInfo
  );

  return adminInfo ? element : <Navigate to="/admin/login" replace />;
};

export default AdminProtectedRoute;
