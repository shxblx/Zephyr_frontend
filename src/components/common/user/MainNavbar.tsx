import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { removeUserInfo } from "../../../redux/slices/userSlice/userSlice";
import {
  ArrowLeftEndOnRectangleIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import { logout } from "../../../api/user";

const MainNavbar = () => {
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
          <Link to="findfriends">
            <button
              className="text-white mr-4 hover:text-[#FF5F09] transition duration-300 ease-in-out"
              title="Search for Friends"
            >
              <MagnifyingGlassIcon className="h-6 w-6 mt-1" />
            </button>
          </Link>
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
    }
    return null;
  };

  return (
    <nav className="bg-black text-white p-4 w-full z-40 fixed top-0 left-0 right-0">
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

        <div className="flex-grow"></div>

        <div>{renderButton()}</div>
      </div>
    </nav>
  );
};

export default MainNavbar;
