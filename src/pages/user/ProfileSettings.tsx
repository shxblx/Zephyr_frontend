import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  changeDisplayName,
  changeUserName,
  changePassword,
} from "../../api/user";
import { setUserInfo } from "../../redux/slices/userSlice/userSlice";
import Swal from "sweetalert2";

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
        confirmButtonColor: "#FF5F09",
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: response.data,
        icon: "error",
        confirmButtonColor: "#FF5F09",
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
        confirmButtonColor: "#FF5F09",
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: response.data,
        icon: "error",
        confirmButtonColor: "#FF5F09",
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
        confirmButtonColor: "#FF5F09",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      Swal.fire({
        title: "Error!",
        text: response.data,
        icon: "error",
        confirmButtonColor: "#FF5F09",
      });
    }

    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
  };

  return (
    <div className="min-h-screen p-4 md:p-8 text-white ">
      <div className="mx-auto max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <Link
            to="/profile"
            className="text-[#FF5F09] hover:text-orange-700 transition"
          >
            Back to Profile
          </Link>
        </div>

        <div className="space-y-6 mb-6">
          <form
            onSubmit={handleUsernameChange}
            className="flex items-center space-x-2"
          >
            <div className="flex-grow">
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-800 text-white p-2 rounded"
              />
              {usernameError && <p className="text-red-500">{usernameError}</p>}
            </div>
            <button
              type="submit"
              className="bg-[#FF5F09] text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors duration-200 self-end"
            >
              Save
            </button>
          </form>

          <form
            onSubmit={handleDisplayNameChange}
            className="flex items-center space-x-2"
          >
            <div className="flex-grow">
              <label
                htmlFor="displayName"
                className="block text-sm font-medium mb-1"
              >
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-gray-800 text-white p-2 rounded"
              />
              {displayNameError && (
                <p className="text-red-500">{displayNameError}</p>
              )}
            </div>
            <button
              type="submit"
              className="bg-[#FF5F09] text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors duration-200 self-end"
            >
              Save
            </button>
          </form>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div className="border-t border-gray-700 pt-6">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium mb-1"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-gray-800 text-white p-2 rounded"
                />
                {currentPasswordError && (
                  <p className="text-red-500">{currentPasswordError}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium mb-1"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-gray-800 text-white p-2 rounded"
                />
                {newPasswordError && (
                  <p className="text-red-500">{newPasswordError}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-1"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-800 text-white p-2 rounded"
                />
                {confirmPasswordError && (
                  <p className="text-red-500">{confirmPasswordError}</p>
                )}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#FF5F09] text-white py-2 rounded hover:bg-orange-700 transition-colors duration-200"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
