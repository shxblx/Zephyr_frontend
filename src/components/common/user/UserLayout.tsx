import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MainNavbar from "./MainNavbar";
import Notifications from "./Notifications";
import { BellIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

const UserLayout: React.FC = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  return (
    <div className="flex flex-col bg-black">
      <MainNavbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isNotificationsOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 flex"
      >
        <Notifications
          isOpen={isNotificationsOpen}
          toggleNotifications={toggleNotifications}
        />
      </motion.div>
      <motion.button
        initial={{ x: 0 }}
        animate={{ x: isNotificationsOpen ? "-320px" : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={toggleNotifications}
        className="fixed top-32 right-0 bg-[#FF5F09] text-white p-3 rounded-tl-md rounded-bl-md shadow-lg hover:bg-[#FF7F3F] transition-colors duration-200 z-50"
      >
        {isNotificationsOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <BellIcon className="h-6 w-6" />
        )}
      </motion.button>
    </div>
  );
};

export default UserLayout;
