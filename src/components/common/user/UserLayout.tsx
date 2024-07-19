import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MainNavbar from "./MainNavbar";

const UserLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <MainNavbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
