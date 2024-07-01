import React from "react";
import MainNavbar from "../../components/common/MainNavbar";
import Sidebar from "../../components/common/Sidebar";
import Discover from "../../components/user/mainhome/Discover";

export const MainHome = () => {
  return (
    <>
      <MainNavbar />
      <Discover/>
      <Sidebar/>
      
    </>
  );
};
