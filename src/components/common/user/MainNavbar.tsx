import React from "react";
import OrangeButton from "./OrangeButton";
import { useSelector } from "react-redux";

const MainNavbar = () => {
  const { userInfo } = useSelector((state: any) => state.userInfo);
  return (
    <nav className="text-white p-4 fixed top-0 left-0 right-0 z-30">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <span
            className="text-3xl md:text-4xl font-bold font-orbitron"
            style={{ color: "#FF5F09" }}
          >
            ZEP
          </span>
          <span className="text-3xl md:text-4xl font-orbitron font-bold">
            <span className="text-transparent hyr-stroke">HYR</span>
          </span>
        </div>

        <div className="font-orbitron font-bold">
          <OrangeButton
            type="button"
            px={32}
            py={8}
            value={userInfo.displayName}
          />
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;
