import React, { useState, useEffect } from "react";
import {
  UserIcon,
  CheckCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { blockUser, getUsers, unblockUser } from "../../api/admin";
import { NoSymbolIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import Loader from "../../components/common/admin/Loader";

interface User {
  _id: string;
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

  const handleBlockUser = async (_id: string, userName: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to block ${userName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, block user!",
    });

    if (result.isConfirmed) {
      try {
        const response = await blockUser({ userId: _id });

        if (response.status === 200) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === _id ? { ...user, isBlocked: true } : user
            )
          );
          Swal.fire("Blocked!", `${userName} has been blocked.`, "success");
        } else {
          Swal.fire("Error!", "Failed to block user.", "error");
        }
      } catch (error) {
        console.error("Error blocking user:", error);
        Swal.fire(
          "Error!",
          "An error occurred while blocking the user.",
          "error"
        );
      }
    }
  };

  const handleUnblockUser = async (_id: string, userName: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to unblock ${userName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, unblock user!",
    });

    if (result.isConfirmed) {
      try {
        const response = await unblockUser({ userId: _id });

        if (response.status === 200) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === _id ? { ...user, isBlocked: false } : user
            )
          );
          Swal.fire("Unblocked!", `${userName} has been unblocked.`, "success");
        } else if (response.status === 404) {
          Swal.fire("Error!", "User not found.", "error");
        } else {
          Swal.fire("Error!", "Failed to unblock user.", "error");
        }
      } catch (error) {
        console.error("Error unblocking user:", error);
        Swal.fire(
          "Error!",
          "An error occurred while unblocking the user.",
          "error"
        );
      }
    }
  };

  const handleViewUser = (_id: string) => {
    console.log(`Viewing user ${_id}`);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 shadow-md overflow-hidden p-5 rounded-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 p-4 text-white">
            User Management
          </h1>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left hidden md:table-cell">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left hidden md:table-cell">
                    Premium
                  </th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-700">
                    <td className="px-4 py-2">
                      <div className="flex items-center">
                        <UserIcon className="h-5 w-5 mr-2" />
                        <div>
                          <div>{user.userName}</div>
                          <div className="text-sm text-gray-400 md:hidden">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 hidden md:table-cell">
                      {user.email}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.isBlocked ? "bg-red-500" : "bg-green-500"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-2 hidden md:table-cell">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.isPremium ? "bg-yellow-500" : "bg-gray-500"
                        }`}
                      >
                        {user.isPremium ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        {user.isBlocked ? (
                          <button
                            onClick={() =>
                              handleUnblockUser(user._id, user.userName)
                            }
                            className="text-green-500 hover:text-red-600"
                            title="Unblock User"
                          >
                            <CheckCircleIcon className="h-6 w-6 md:h-8 md:w-8" />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleBlockUser(user._id, user.userName)
                            }
                            className="text-red-500 hover:text-green-600"
                            title="Block User"
                          >
                            <NoSymbolIcon className="h-6 w-6 md:h-8 md:w-8" />
                          </button>
                        )}
                        <button
                          onClick={() => handleViewUser(user._id)}
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
      </div>
    </div>
  );
};

export default AdminUsers;
