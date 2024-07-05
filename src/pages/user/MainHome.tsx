import React from "react";
import MainNavbar from "../../components/common/user/MainNavbar";
import Sidebar from "../../components/common/user/Sidebar";
import Discover from "../../components/user/mainhome/Discover";

export const MainHome = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <MainNavbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Discover />
        </div>
      </div>
    </div>
  );
};
