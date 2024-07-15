import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export const ProfileSettings = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: any) => state.userInfo);

  const [username, setUsername] = useState(userInfo.userName);
  const [displayName, setDisplayName] = useState(userInfo.displayName);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUsernameChange = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Username change submitted", { username });
  };

  const handleDisplayNameChange = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Display name change submitted", { displayName });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password change submitted", { currentPassword, newPassword, confirmPassword });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 text-white ">
      <div className="mx-auto max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <Link to="/profile" className="text-[#FF5F09] hover:text-orange-700 transition">
            Back to Profile
          </Link>
        </div>

        <div className="space-y-6 mb-6">
          <form onSubmit={handleUsernameChange} className="flex items-center space-x-2">
            <div className="flex-grow">
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-800 text-white p-2 rounded"
              />
            </div>
            <button type="submit" className="bg-[#FF5F09] text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors duration-200 self-end">
              Save
            </button>
          </form>

          <form onSubmit={handleDisplayNameChange} className="flex items-center space-x-2">
            <div className="flex-grow">
              <label htmlFor="displayName" className="block text-sm font-medium mb-1">
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-gray-800 text-white p-2 rounded"
              />
            </div>
            <button type="submit" className="bg-[#FF5F09] text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors duration-200 self-end">
              Save
            </button>
          </form>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div className="border-t border-gray-700 pt-6">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-gray-800 text-white p-2 rounded"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-gray-800 text-white p-2 rounded"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-800 text-white p-2 rounded"
                />
              </div>
            </div>
          </div>
          <button type="submit" className="w-full bg-[#FF5F09] text-white py-2 rounded hover:bg-orange-700 transition-colors duration-200">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};