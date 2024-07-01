import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import OrangeButton from "./OrangeButton";

const MainNavbar = () => {

  return (
    <nav className="bg-black flex text-white p-4">
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
      </div>
      <div className="font-orbitron font-bold">
        <OrangeButton type="button" px={12} py={8} value="Username"/>
      </div>
    </nav>
  );
};

export default MainNavbar;
