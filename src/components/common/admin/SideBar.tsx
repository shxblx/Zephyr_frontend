import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  UsersIcon,
  ChatBubbleLeftRightIcon,
  FlagIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { adminLogout } from "../../../api/admin";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { removeAdminInfo } from "../../../redux/slices/adminSlice/adminSlice";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleLogout = async () => {
    try {
      const response = await adminLogout();
      if (response.status === 200) {
        dispatch(removeAdminInfo());
        toast.success(response.data.message);
        navigate("/admin/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

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
            className={`flex items-center py-2 px-4 ${
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
      <div className="absolute bottom-0 w-full px-4 py-2">
        <button
          onClick={handleLogout}
          className={`flex items-center py-2 px-4 ${
            isOpen ? "text-white hover:bg-black" : "text-white"
          }`}
        >
          <ArrowLeftEndOnRectangleIcon
            className={`w-6 h-6 ${isOpen ? "mr-3" : "mx-auto"}`}
          />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
