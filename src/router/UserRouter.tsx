import React from "react";
import { Route, Routes } from "react-router-dom";
import { Homepage } from "../components/user/homepage/Homepage";
import { Signup } from "../components/user/signup/Signup";

export const UserRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};
