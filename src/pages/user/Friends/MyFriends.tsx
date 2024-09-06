import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { getFriends, fetchMessages } from "../../../api/friends";
import FriendChat from "./FriendChat";
import socket from "../../../components/common/socket";

interface Friend {
  _id: string;
  userName: string;
  displayName: string;
  profilePicture: string;
  status: string;
  friendId: string;
  lastMessage?: {
    content: string;
    timestamp: string;
    fileUrl?: string;
    fileType?: string;
  };
}

interface Message {
  _id: string;
  conversationId: string;
  sender: string;
  content: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  fileUrl?: string;
  fileType?: string;
}

const MyFriends: React.FC = () => {
  const { userInfo } = useSelector((state: any) => state.userInfo);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [loading, setLoading] = useState(false);

  const sortFriends = useCallback((friendsToSort: Friend[]) => {
    return [...friendsToSort].sort((a: Friend, b: Friend) => {
      const aTimestamp = a.lastMessage?.timestamp
        ? new Date(a.lastMessage.timestamp).getTime()
        : 0;
      const bTimestamp = b.lastMessage?.timestamp
        ? new Date(b.lastMessage.timestamp).getTime()
        : 0;
      return bTimestamp - aTimestamp;
    });
  }, []);

  useEffect(() => {
    fetchFriendsAndMessages();
    const storedFriend = localStorage.getItem("selectedFriend");
    if (storedFriend) {
      setSelectedFriend(JSON.parse(storedFriend));
    }

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);

  const handleNewMessage = useCallback(
    (message: Message) => {
      setFriends((prevFriends) => {
        const updatedFriends = prevFriends.map((friend) => {
          if (
            friend._id === message.sender ||
            friend._id ===
              message.conversationId
                .replace(userInfo.userId, "")
                .replace("-", "")
          ) {
            return {
              ...friend,
              lastMessage: {
                content: message.content,
                timestamp: message.timestamp,
                fileUrl: message.fileUrl,
                fileType: message.fileType,
              },
            };
          }
          return friend;
        });
        return sortFriends(updatedFriends);
      });
    },
    [userInfo.userId, sortFriends]
  );

  const fetchFriendsAndMessages = async () => {
    setLoading(true);
    try {
      const response = await getFriends(userInfo.userId);
      if (
        response &&
        response.data &&
        response.data.data &&
        response.data.data.friends
      ) {
        const friendsWithMessages = await Promise.all(
          response.data.data.friends.map(async (friend: Friend) => {
            const messages = await fetchMessages(userInfo.userId, friend._id);
            const lastMessage = messages.data[messages.data.length - 1];
            return {
              ...friend,
              lastMessage: lastMessage
                ? {
                    content: lastMessage.content,
                    timestamp: lastMessage.timestamp,
                    fileUrl: lastMessage.fileUrl,
                    fileType: lastMessage.fileType,
                  }
                : undefined,
            };
          })
        );

        setFriends(sortFriends(friendsWithMessages));
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
    setFriends((prevFriends) =>
      sortFriends(prevFriends.filter((friend) => friend._id !== friendId))
    );
    setSelectedFriend(null);
    localStorage.removeItem("selectedFriend");
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] ml-0 lg:ml-64 bg-black overflow-hidden">
      <div
        className={`w-full lg:w-1/3 bg-black border-r border-gray-800 flex flex-col ${
          selectedFriend ? "hidden lg:flex" : "flex"
        }`}
      >
        <div className="flex justify-between items-center p-4">
          <h2 className="text-white text-2xl font-semibold">My Friends</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#ff5f09]"></div>
            </div>
          ) : friends.length > 0 ? (
            <div className="space-y-4 p-4">
              {friends.map((friend) => (
                <div
                  key={friend._id}
                  className={`rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedFriend?._id === friend._id
                      ? "bg-gray-800 border-2 border-[#ff5f09]"
                      : "bg-gray-900 border border-gray-700 hover:bg-gray-800"
                  }`}
                  onClick={() => handleSelectFriend(friend)}
                >
                  <div className="flex items-center">
                    <img
                      src={friend.profilePicture || "/default-avatar.png"}
                      alt={friend.displayName}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="text-white text-lg font-semibold">
                        {friend.displayName}
                      </h3>
                      {friend.lastMessage ? (
                        <div>
                          <p className="text-gray-400 text-sm truncate">
                            {friend.lastMessage.fileUrl
                              ? `Sent a ${friend.lastMessage.fileType}`
                              : friend.lastMessage.content}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {formatTimestamp(friend.lastMessage.timestamp)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No messages yet</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500">
              <p className="text-xl text-center">
                Add friends to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
      <div
        className={`w-full lg:w-2/3 bg-black flex flex-col border-l border-gray-800 ${
          selectedFriend
            ? "flex"
            : "hidden lg:flex lg:items-center lg:justify-center"
        }`}
      >
        {selectedFriend ? (
          <FriendChat
            selectedFriend={selectedFriend}
            userInfo={userInfo}
            onBackClick={handleBackClick}
            onRemoveFriend={handleRemoveFriend}
            onNewMessage={handleNewMessage}
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
