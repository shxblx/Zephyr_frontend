import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  changeDisplayName,
  changeUserName,
  changePassword,
} from "../../api/user";
import { setUserInfo } from "../../redux/slices/userSlice/userSlice";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const validatePassword = (password: string) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
};

export const ProfileSettings = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: any) => state.userInfo);

  const [username, setUsername] = useState(userInfo.userName);
  const [displayName, setDisplayName] = useState(userInfo.displayName);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [displayNameError, setDisplayNameError] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();

    const usernameRegex = /^[a-z]+$/;
    if (!username.trim()) {
      setUsernameError("Username is required.");
      return;
    } else if (!usernameRegex.test(username)) {
      setUsernameError(
        "Username can only contain lowercase letters and no spaces."
      );
      return;
    }

    const response = await changeUserName({
      userId: userInfo.userId,
      newName: username,
    });

    if (response.status === 200) {
      dispatch(
        setUserInfo({
          ...userInfo,
          userName: username,
        })
      );
      Swal.fire({
        title: "Success!",
        text: response.data,
        icon: "success",
        confirmButtonColor: "#4B5563",
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: response.data,
        icon: "error",
        confirmButtonColor: "#4B5563",
      });
    }
    setUsernameError("");
  };

  const handleDisplayNameChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName.trim()) {
      setDisplayNameError("Display Name is required.");
      return;
    }

    const response = await changeDisplayName({
      userId: userInfo.userId,
      newName: displayName,
    });

    if (response.status === 200) {
      dispatch(
        setUserInfo({
          ...userInfo,
          displayName: displayName,
        })
      );
      Swal.fire({
        title: "Success!",
        text: response.data,
        icon: "success",
        confirmButtonColor: "#4B5563",
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: response.data,
        icon: "error",
        confirmButtonColor: "#4B5563",
      });
    }
    setDisplayNameError("");
  };
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword.trim()) {
      setCurrentPasswordError("Current Password is required.");
      return;
    }

    if (!validatePassword(newPassword)) {
      setNewPasswordError(
        "New Password must contain at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    const response = await changePassword({
      userId: userInfo.userId,
      currentPassword: currentPassword,
      newPassword: newPassword,
    });

    if (response.status === 200) {
      Swal.fire({
        title: "Success!",
        text: response.data,
        icon: "success",
        confirmButtonColor: "#4B5563",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      Swal.fire({
        title: "Error!",
        text: response.data,
        icon: "error",
        confirmButtonColor: "#4B5563",
      });
    }

    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen p-4 md:p-8 text-white bg-gradient-to-b from-gray-900 to-black">
      <motion.div
        className="mx-auto max-w-2xl"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-300">Profile Settings</h1>
          <Link
            to="/profile"
            className="text-gray-400 hover:text-gray-200 transition"
          >
            Back to Profile
          </Link>
        </div>

        <motion.div className="space-y-6 mb-6" variants={fadeInUp}>
          <form
            onSubmit={handleUsernameChange}
            className="flex items-center space-x-2"
          >
            <div className="flex-grow">
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-1 text-gray-400"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700 focus:border-gray-500 focus:outline-none"
              />
              {usernameError && <p className="text-red-500">{usernameError}</p>}
            </div>
            <motion.button
              type="submit"
              className="bg-[#FF5F09] text-white py-2 px-4 rounded hover:bg-orange-800 transition-colors duration-200 self-end"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save
            </motion.button>
          </form>

          <form
            onSubmit={handleDisplayNameChange}
            className="flex items-center space-x-2"
          >
            <div className="flex-grow">
              <label
                htmlFor="displayName"
                className="block text-sm font-medium mb-1 text-gray-400"
              >
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700 focus:border-gray-500 focus:outline-none"
              />
              {displayNameError && (
                <p className="text-red-500">{displayNameError}</p>
              )}
            </div>
            <motion.button
              type="submit"
              className="bg-[#FF5F09] text-white py-2 px-4 rounded hover:bg-orange-800 transition-colors duration-200 self-end"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save
            </motion.button>
          </form>
        </motion.div>

        <motion.form
          onSubmit={handlePasswordChange}
          className="space-y-6"
          variants={fadeInUp}
        >
          <div className="border-t border-gray-700 pt-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-300">
              Change Password
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium mb-1 text-gray-400"
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-gray-800 text-white p-2 pr-10 rounded border border-gray-700 focus:border-gray-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                  >
                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {currentPasswordError && (
                  <p className="text-red-500">{currentPasswordError}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium mb-1 text-gray-400"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-800 text-white p-2 pr-10 rounded border border-gray-700 focus:border-gray-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {newPasswordError && (
                  <p className="text-red-500">{newPasswordError}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-1 text-gray-400"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-800 text-white p-2 pr-10 rounded border border-gray-700 focus:border-gray-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {confirmPasswordError && (
                  <p className="text-red-500">{confirmPasswordError}</p>
                )}
              </div>
            </div>
          </div>
          <motion.button
            type="submit"
            className="w-full bg-[#FF5F09] text-white py-2 rounded hover:bg-orange-800 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Change Password
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ProfileSettings;
