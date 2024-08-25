import  { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { removeUserInfo } from "../../../redux/slices/userSlice/userSlice";
import {
  ArrowLeftEndOnRectangleIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import { logout } from "../../../api/user";

const MainNavbar = () => {
  const { userInfo } = useSelector((state:any) => state.userInfo);
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState(false);

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

  const getStatusColor = () => {
    switch (userInfo?.status) {
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

  const renderButton = () => {
    if (userInfo && userInfo.displayName) {
      return (
        <div className="flex items-center">
          <div className="hidden md:flex items-center">
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
          </div>
          <Link to="/profile" className="flex items-center">
            <div className="relative">
              {userInfo.profile ? (
                <img
                  src={userInfo.profile}
                  alt="Profile"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full mr-2 md:mr-4 object-cover"
                />
              ) : (
                <UserCircleIcon className="w-8 h-8 md:w-12 md:h-12 text-[#FF5F09] mr-2 md:mr-4" />
              )}
              <div
                className={`absolute top-6 md:top-8 right-2 md:right-4 w-2 md:w-3 h-2 md:h-3 ${getStatusColor()} rounded-full border-2 border-black`}
              ></div>
            </div>
            <button className="orange-button text-white text-sm md:text-l focus:outline-none border-2 border-[#FF5F09] px-4 md:px-8 py-1 md:py-2 font-bold font-orbitron mr-2 md:mr-4">
              <span className="relative z-10">{userInfo.displayName}</span>
            </button>
          </Link>
          <div className="md:hidden relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="text-white hover:text-[#FF5F09] transition duration-300 ease-in-out"
            >
              <EllipsisVerticalIcon className="h-6 w-6" />
            </button>
            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-black rounded-md shadow-lg py-1 z-50">
                <Link
                  to="findfriends"
                  className="block px-4 py-2 text-sm text-white hover:bg-gray-800"
                >
                  Search for Friends
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <nav className="bg-black text-white p-4 w-full z-40 sticky top-0 left-0 right-0">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <span
              className="text-2xl md:text-3xl lg:text-4xl font-bold font-orbitron"
              style={{ color: "#FF5F09" }}
            >
              ZEP
            </span>
            <span className="text-2xl md:text-3xl lg:text-4xl font-orbitron font-bold">
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