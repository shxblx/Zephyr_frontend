import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  UsersIcon,
  ChatBubbleLeftRightIcon,
  FlagIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { name: "Dashboard", icon: ChartBarIcon, path: "/admin/dashboard" },
    { name: "Users", icon: UsersIcon, path: "/admin/users" },
    {
      name: "Communities",
      icon: ChatBubbleLeftRightIcon,
      path: "/admin/communities",
    },
    { name: "Reports", icon: FlagIcon, path: "/admin/reports" },
    { name: "Support", icon: QuestionMarkCircleIcon, path: "/admin/support" },
  ];

  return (
    <div
      className={`bg-ff5f09 text-white h-screen ${
        isOpen ? "w-64" : "w-20"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="flex justify-end p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white focus:outline-none"
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>
      <nav className="mt-8">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center py-2 px-4  ${
              location.pathname === item.path
                ? "bg-white text-black"
                : "text-white hover:bg-black"
            }`}
          >
            <item.icon className={`w-6 h-6 ${isOpen ? "mr-3" : "mx-auto"}`} />
            {isOpen && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
