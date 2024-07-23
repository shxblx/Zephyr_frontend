import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  CheckIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { getGlobalFriends, addFriend } from "../../../api/friends";

interface Friend {
  _id: string;
  userName: string;
  displayName: string;
  profilePicture: string | null;
  status: string;
}

const FindFriends: React.FC = () => {
  const { userInfo } = useSelector((state: any) => state.userInfo);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [addedFriends, setAddedFriends] = useState<Set<string>>(new Set());

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchFriends(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, userInfo.userId]);

  const fetchFriends = async (search: string = "") => {
    setLoading(true);
    try {
      const response = await getGlobalFriends(userInfo.userId, search);
      console.log(response);

      if (response && response.data && response.data.users) {
        setFriends(response.data.users);
      } else {
        setFriends([]);
        if (search) {
          toast.error("No users found");
        } else {
          toast.error("Failed to fetch friends data");
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch friends. Please try again later.");
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (friendId: string) => {
    try {
      const response = await addFriend({ userId: userInfo.userId, friendId });
      if (response && response.status === 200) {
        toast.success("Friend added successfully!");
        setAddedFriends((prev) => new Set(prev).add(friendId));
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      toast.error("An error occurred while adding friend.");
    }
  };

  return (
    <div className="flex-1 ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6 text-white">Find Friends</h1>
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg pl-10"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FF5F09]"></div>
          </div>
        ) : friends.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <div
                key={friend._id}
                className="bg-gray-800 rounded-lg p-4 flex flex-col items-center"
              >
                {friend.profilePicture ? (
                  <img
                    src={friend.profilePicture}
                    alt={friend.displayName}
                    className="w-24 h-24 rounded-full object-cover mb-2"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-2">
                    <UserIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <h3 className="text-white text-lg font-semibold">
                  {friend.displayName}
                </h3>
                <p className="text-gray-400 text-sm">@{friend.userName}</p>
                <p
                  className={`text-sm mb-2 ${
                    friend.status === "Online"
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  {friend.status}
                </p>
                <button
                  onClick={() => handleAddFriend(friend._id)}
                  className={`p-2 rounded-full transition-colors ${
                    addedFriends.has(friend._id)
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-[#FF5F09] hover:bg-orange-600"
                  }`}
                >
                  {addedFriends.has(friend._id) ? (
                    <CheckIcon className="w-5 h-5 text-white" />
                  ) : (
                    <PlusIcon className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-64 bg-gray-800 rounded-lg">
            <UserIcon className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-white text-lg font-semibold">No users found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm
                ? "Try a different search term"
                : "No friends available at the moment"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindFriends;
