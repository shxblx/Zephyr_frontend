import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { removeUserInfo } from "../../../redux/slices/userSlice/userSlice";
import {
  ArrowLeftEndOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import { logout } from "../../../api/user";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { userInfo } = useSelector((state: any) => state.userInfo);
  const dispatch = useDispatch();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      iconColor: "#FF5F09",
      showCancelButton: true,
      confirmButtonColor: "#FF5F09",
      cancelButtonColor: "black",
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "swal-confirm-button",
        cancelButton: "swal-cancel-button",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await logout();

        dispatch(removeUserInfo());
        Swal.fire({
          title: "Logged Out!",
          text: "You have been successfully logged out.",
          icon: "success",
          iconColor: "#FF5F09",
          confirmButtonColor: "#FF5F09",
        });
      }
    });
  };

  const renderButton = () => {
    if (userInfo && userInfo.displayName) {
      const getStatusColor = () => {
        switch (userInfo.status) {
          case "Online":
            return "bg-green-500";
          case "Do Not Disturb":
            return "bg-red-500";
          case "Idle":
            return "bg-yellow-500";
          default:
            return "bg-gray-500";
        }
      };

      return (
        <div className="flex items-center">
          <button
            onClick={handleLogout}
            className="text-white mr-4 hover:text-[#FF5F09] transition duration-300 ease-in-out"
          >
            <ArrowLeftEndOnRectangleIcon className="h-6 w-6" />
          </button>
          <Link to="/profile" className="flex items-center">
            <div className="relative">
              {userInfo.profile ? (
                <img
                  src={userInfo.profile}
                  alt="Profile"
                  className="w-10 h-10 rounded-full mr-4 object-cover"
                />
              ) : (
                <UserCircleIcon className="w-12 h-12 text-[#FF5F09] mr-4" />
              )}
              <div
                className={`absolute top-8 right-4 w-3 h-3 ${getStatusColor()} rounded-full border-2 border-black`}
              ></div>
            </div>
            <button className="orange-button text-white text-l focus:outline-none border-2 border-[#FF5F09] px-8 py-2 font-bold font-orbitron mr-4">
              <span className="relative z-10">{userInfo.displayName}</span>
            </button>
          </Link>
        </div>
      );
    } else if (location.pathname === "/signup") {
      return (
        <Link to="/login">
          <button className="orange-button text-white text-l focus:outline-none border-2 border-[#FF5F09] px-8 py-2 font-bold font-orbitron">
            <span className="relative z-10">Login</span>
          </button>
        </Link>
      );
    } else if (location.pathname === "/login") {
      return (
        <Link to="/signup">
          <button className="orange-button text-white text-l focus:outline-none border-2 border-[#FF5F09] px-8 py-2 font-bold font-orbitron">
            <span className="relative z-10">Sign Up</span>
          </button>
        </Link>
      );
    } else {
      return (
        <Link to="/signup">
          <button className="orange-button text-white text-l focus:outline-none border-2 border-[#FF5F09] px-8 py-2 font-bold font-orbitron">
            <span className="relative z-10">Sign Up</span>
          </button>
        </Link>
      );
    }
  };

  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <span
              className="text-3xl md:text-4xl font-bold font-orbitron"
              style={{ color: "#FF5F09" }}
            >
              ZEP
            </span>
            <span className="text-3xl md:text-4xl font-orbitron font-bold">
              <span className="text-transparent hyr-stroke">HYR</span>
            </span>
          </Link>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                />
              )}
            </svg>
          </button>
        </div>

        <div className="hidden text-xs md:flex items-center justify-center space-x-6 lg:space-x-12 flex-grow">
          <Link
            to="/"
            className="text-white transition duration-300 ease-in-out hover:text-[#FF5F09] font-bold font-orbitron"
          >
            Home
          </Link>
          <Link
            to="/home"
            className="text-white transition duration-300 ease-in-out hover:text-[#FF5F09] font-bold font-orbitron"
          >
            Zephyr!
          </Link>
          <Link
            to="/about"
            className="text-white transition duration-300 ease-in-out hover:text-[#FF5F09] font-bold font-orbitron"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="text-white transition duration-300 ease-in-out hover:text-[#FF5F09] font-bold font-orbitron"
          >
            Contact
          </Link>
        </div>

        <div className="hidden md:block">{renderButton()}</div>
      </div>

      {isOpen && (
        <div className="bg-ff5f09 md:hidden mt-4 flex flex-col items-center">
          {renderButton()}
          <Link
            to="/"
            className="py-2 text-white hover:text-[#FF5F09] font-bold font-orbitron"
          >
            Home
          </Link>
          <Link
            to="/zephyr"
            className="py-2 text-white hover:text-[#FF5F09] font-bold font-orbitron"
          >
            Zephyr!
          </Link>
          <Link
            to="/about"
            className="py-2 text-white hover:text-[#FF5F09] font-bold font-orbitron"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="py-2 text-white hover:text-[#FF5F09] font-bold font-orbitron"
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
