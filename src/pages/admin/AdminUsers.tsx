import React, { useState, useEffect } from "react";
import {
  UserIcon,
  CheckCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { getUsers } from "../../api/admin";
import { NoSymbolIcon } from "@heroicons/react/24/solid";

interface User {
  id: string;
  userName: string;
  displayName: string;
  email: string;
  isBlocked: boolean;
  isPremium: boolean;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        if (response && response.data) {
          const data = response.data.data;
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleBlockUser = async (userId: string) => {
    console.log(`Blocking user ${userId}`);
  };

  const handleUnblockUser = async (userId: string) => {
    console.log(`Unblocking user ${userId}`);
  };

  const handleViewUser = (userId: string) => {
    console.log(`Viewing user ${userId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 ">
      <h1 className="text-3xl font-bold mb-6 text-white">User Management</h1>
      <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-white">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Username</th>
              <th className="px-6 py-3 text-left">Display Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Premium</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-700">
                <td className="px-6 py-4 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  {user.userName}
                </td>
                <td className="px-6 py-4">{user.displayName}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.isBlocked ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.isPremium ? "bg-yellow-500" : "bg-gray-500"
                    }`}
                  >
                    {user.isPremium ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    {user.isBlocked ? (
                      <button
                        onClick={() => handleUnblockUser(user.id)}
                        className="text-red-500 hover:text-green-600"
                        title="Unblock User"
                      >
                        <NoSymbolIcon className="h-8 w-8" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlockUser(user.id)}
                        className="text-green-500 hover:text-red-600"
                        title="Block User"
                      >
                        <CheckCircleIcon className="h-8 w-8" />
                      </button>
                    )}
                    <button
                      onClick={() => handleViewUser(user.id)}
                      className="text-blue-500 hover:text-blue-600"
                      title="View User"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
