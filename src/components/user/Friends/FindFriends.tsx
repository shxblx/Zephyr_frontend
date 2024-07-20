import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { CheckIcon, PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { getGlobalFriends, addFriend } from "../../../api/friends";

interface Friend {
  _id: string;
  userName: string;
  displayName: string;
  profilePicture: string;
  status: string;
}

const FindFriends: React.FC = () => {
  const { userInfo } = useSelector((state: any) => state.userInfo);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [addedFriends, setAddedFriends] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchFriends();
  }, [userInfo.userId]);

  useEffect(() => {
    const filtered = friends.filter(
      (friend) =>
        friend.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFriends(filtered);
  }, [searchTerm, friends]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const response = await getGlobalFriends(userInfo.userId);
      if (response && response.data && response.data.users) {
        setFriends(response.data.users);
      } else {
        toast.error("Failed to fetch friends data");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch friends. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (friendId: string) => {
    try {
      const response = await addFriend({ userId: userInfo.userId, friendId });
      if (response && response.status === 200) {
        toast.success("Friend added successfully!");
        setAddedFriends(prev => new Set(prev).add(friendId));
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      toast.error("An error occurred while adding friend.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-white text-2xl font-semibold mb-4">Find Friends</h2>
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
        <div className="text-white">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFriends.map((friend) => (
            <div key={friend._id} className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
              <img
                src={friend.profilePicture}
                alt={friend.displayName}
                className="w-24 h-24 rounded-full object-cover mb-2"
              />
              <h3 className="text-white text-lg font-semibold">{friend.displayName}</h3>
              <p className="text-gray-400 text-sm">@{friend.userName}</p>
              <p className={`text-sm mb-2 ${friend.status === 'Online' ? 'text-green-500' : 'text-gray-500'}`}>
                {friend.status}
              </p>
              <button
                onClick={() => handleAddFriend(friend._id)}
                className={`p-2 rounded-full transition-colors ${
                  addedFriends.has(friend._id)
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-ff5f09 hover:bg-orange-600"
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
      )}
    </div>
  );
};

export default FindFriends;