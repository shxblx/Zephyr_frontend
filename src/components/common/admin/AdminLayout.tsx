import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";

const UserLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
