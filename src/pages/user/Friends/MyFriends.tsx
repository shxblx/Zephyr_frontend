import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  ChatBubbleLeftRightIcon,
  ArrowLeftIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { getFriends, removeFriend } from "../../../api/friends";

interface Friend {
  _id: string;
  userName: string;
  displayName: string;
  profilePicture: string;
  status: string;
  friendId: string;
  createdAt: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  senderPicture: string;
}

const MyFriends: React.FC = () => {
  const { userInfo } = useSelector((state: any) => state.userInfo);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    if (selectedFriend) {
      // Simulate fetching messages for the selected friend
      const dummyMessages: Message[] = [
        {
          id: "1",
          senderId: userInfo.userId,
          content: "Hey there! How are you?",
          timestamp: new Date(Date.now() - 300000),
          senderPicture: userInfo.profile,
        },
        {
          id: "2",
          senderId: selectedFriend._id,
          content: "Hi! I'm doing great, thanks for asking. How about you?",
          timestamp: new Date(Date.now() - 240000),
          senderPicture: selectedFriend.profilePicture,
        },
        {
          id: "3",
          senderId: userInfo.userId,
          content: "I'm doing well too! Just working on some coding projects.",
          timestamp: new Date(Date.now() - 180000),
          senderPicture: userInfo.profile,
        },
        {
          id: "4",
          senderId: selectedFriend._id,
          content: "That sounds interesting! What are you working on?",
          timestamp: new Date(Date.now() - 120000),
          senderPicture: selectedFriend.profilePicture,
        },
      ];
      setMessages(dummyMessages);
    }
  }, [selectedFriend, userInfo]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const response = await getFriends(userInfo.userId);
      console.log(response);

      if (
        response &&
        response.data &&
        response.data.data &&
        response.data.data.friends
      ) {
        setFriends(response.data.data.friends);
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      toast.error("No Friends Found, Add a Friend");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedFriend) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: userInfo.userId,
        content: newMessage.trim(),
        timestamp: new Date(),
        senderPicture: userInfo.profilePicture,
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleBackClick = () => {
    setSelectedFriend(null);
    setShowMenu(false);
  };

  const handleRemoveFriend = async () => {
    if (selectedFriend) {
      try {
        await removeFriend({
          userId: userInfo.userId,
          friendId: selectedFriend.friendId,
        });
        toast.success(
          `${selectedFriend.displayName} has been removed from your friends list.`
        );
        // Update the friends list immediately
        setFriends(
          friends.filter((friend) => friend._id !== selectedFriend._id)
        );
        setSelectedFriend(null);
      } catch (error) {
        console.error("Error removing friend:", error);
        toast.error("Failed to remove friend. Please try again.");
      }
    }
    setShowMenu(false);
  };

  return (
    <div className="mt-8 lg:mt-0 flex h-full ml-0 lg:ml-64 bg-black">
      <div
        className={`w-full lg:w-1/3 bg-black p-4 overflow-y-auto border-r border-gray-800 ${
          selectedFriend ? "hidden lg:block" : "block"
        }`}
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
                onClick={() => setSelectedFriend(friend)}
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
      >
        {selectedFriend ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <button
                  onClick={handleBackClick}
                  className="text-white hover:text-gray-300 mr-4"
                >
                  <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h3 className="text-white text-2xl font-semibold">
                  {selectedFriend.displayName}
                </h3>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-white hover:text-gray-300"
                >
                  <EllipsisVerticalIcon className="w-6 h-6" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
                    <ul className="py-1">
                      <li>
                        <button
                          onClick={handleRemoveFriend}
                          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                          Remove Friend
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-grow overflow-y-auto mb-4 border border-gray-700 rounded-lg p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start mb-4 ${
                    message.senderId === userInfo.userId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.senderId !== userInfo.userId && (
                    <img
                      src={message.senderPicture}
                      alt="Sender"
                      className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
                    />
                  )}
                  <div
                    className={`flex flex-col ${
                      message.senderId === userInfo.userId
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <span
                      className={`inline-block p-2 rounded-lg ${
                        message.senderId === userInfo.userId
                          ? "bg-[#ff5f09] text-white"
                          : "bg-gray-700 text-white"
                      }`}
                    >
                      {message.content}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.senderId === userInfo.userId && (
                    <img
                      src={message.senderPicture}
                      alt="Sender"
                      className="w-8 h-8 rounded-full ml-2 flex-shrink-0"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex border-t border-gray-700 pt-2 mt-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow bg-gray-800 text-white rounded-l-lg px-4 py-2 focus:outline-none border border-gray-700"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="bg-[#ff5f09] text-white px-6 py-2 rounded-r-lg hover:bg-orange-700 focus:outline-none transition-colors"
              >
                Send
              </button>
            </div>
          </>
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
