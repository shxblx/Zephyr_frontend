// MyFriends.tsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { getFriends } from "../../../api/friends";
import FriendChat from "./FriendChat";

interface Friend {
  _id: string;
  userName: string;
  displayName: string;
  profilePicture: string;
  status: string;
  friendId: string;
  createdAt: string;
}

const MyFriends: React.FC = () => {
  const { userInfo } = useSelector((state: any) => state.userInfo);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFriends();
    const storedFriend = localStorage.getItem("selectedFriend");
    if (storedFriend) {
      setSelectedFriend(JSON.parse(storedFriend));
    }
  }, []);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const response = await getFriends(userInfo.userId);

      if (
        response &&
        response.data &&
        response.data.data &&
        response.data.data.friends
      ) {
        setFriends(response.data.data.friends);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      toast.error("No Friends Found, Add a Friend");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFriend = (friend: Friend) => {
    setSelectedFriend(friend);
    localStorage.setItem("selectedFriend", JSON.stringify(friend));
  };

  const handleBackClick = () => {
    setSelectedFriend(null);
    localStorage.removeItem("selectedFriend");
  };

  const handleRemoveFriend = (friendId: string) => {
    setFriends(friends.filter((friend) => friend._id !== friendId));
    setSelectedFriend(null);
    localStorage.removeItem("selectedFriend");
  };

  return (
    <div className="mt-8 lg:mt-0 flex h-full ml-0 lg:ml-64 bg-black">
      <div
        className={`w-full lg:w-1/3 bg-black p-4 border-r border-gray-800 ${
          selectedFriend ? "hidden lg:block" : "block"
        }`}
        style={{
          height: "calc(100vh - 4rem)",
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <h2 className="text-white text-2xl font-semibold mb-4">My Friends</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#ff5f09]"></div>
          </div>
        ) : friends.length > 0 ? (
          <div className="space-y-4">
            {friends.map((friend) => (
              <div
                key={friend._id}
                className={`rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedFriend?._id === friend._id
                    ? "border-2 border-[#ff5f09]"
                    : "border border-gray-700"
                }`}
                onClick={() => handleSelectFriend(friend)}
              >
                <div className="flex items-center">
                  <img
                    src={friend.profilePicture}
                    alt={friend.displayName}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-white text-lg font-semibold">
                      {friend.displayName}
                    </h3>
                    <p className="text-gray-400 text-sm">@{friend.userName}</p>
                    <p
                      className={`text-sm ${
                        friend.status === "Online"
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      {friend.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-500">
            <p className="text-xl text-center">Add friends to start chatting</p>
          </div>
        )}
      </div>
      <div
        className={`w-full lg:w-2/3 bg-black p-4 flex flex-col border-l border-gray-800 ${
          selectedFriend
            ? "block"
            : "hidden lg:flex lg:items-center lg:justify-center"
        }`}
        style={{ height: "calc(100vh - 4rem)" }}
      >
        {selectedFriend ? (
          <FriendChat
            selectedFriend={selectedFriend}
            userInfo={userInfo}
            onBackClick={handleBackClick}
            onRemoveFriend={handleRemoveFriend}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <ChatBubbleLeftRightIcon className="w-16 h-16 mb-4" />
            <p className="text-xl text-center">
              {friends.length > 0
                ? "Choose a friend to start chatting"
                : "Add friends to start chatting"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFriends;
