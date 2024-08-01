// FriendChat.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { removeFriend, sendMessage } from "../../../api/friends";
import socket from "../../../components/common/socket";

interface Friend {
  _id: string;
  userName: string;
  displayName: string;
  profilePicture: string;
  status: string;
  friendId: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  senderPicture: string;
}

interface FriendChatProps {
  selectedFriend: Friend | null;
  userInfo: any;
  onBackClick: () => void;
  onRemoveFriend: (friendId: string) => void;
}

const FriendChat: React.FC<FriendChatProps> = ({
  selectedFriend,
  userInfo,
  onBackClick,
  onRemoveFriend,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [roomId, setRoomId] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedFriend && userInfo) {
      const newRoomId = [userInfo.userId, selectedFriend._id].sort().join("-");
      setRoomId(newRoomId);

      socket.emit("join", { room: newRoomId });

      socket.on("newMessage", (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.emit("leave", { room: newRoomId });
        socket.off("newMessage");
      };
    }
  }, [selectedFriend, userInfo]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedFriend) {
      const messageData = {
        senderId: userInfo.userId,
        receiverId: selectedFriend._id,
        content: newMessage.trim(),
      };

      try {
        const response = await sendMessage(messageData);

        const message: Message = {
          id: response.id || Date.now().toString(),
          senderId: userInfo.userId,
          content: newMessage.trim(),
          timestamp: response.timestamp || new Date().toISOString(),
          senderPicture: userInfo.profilePicture,
        };

        // Emit the message through socket
        socket.emit("sendMessage", { room: roomId, message });

        // Add message to local state
        setMessages((prevMessages) => [...prevMessages, message]);

        // Clear input
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message. Please try again.");
      }
    }
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
        onRemoveFriend(selectedFriend._id);
      } catch (error) {
        console.error("Error removing friend:", error);
        toast.error("Failed to remove friend. Please try again.");
      }
    }
    setShowMenu(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button
            onClick={onBackClick}
            className="text-white hover:text-gray-300 mr-4"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h3 className="text-white text-2xl font-semibold">
            {selectedFriend?.displayName}
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
                src={selectedFriend?.profilePicture}
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
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
            {message.senderId === userInfo.userId && (
              <img
                src={userInfo.profile}
                alt="Sender"
                className="w-8 h-8 rounded-full ml-2 flex-shrink-0"
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex border-t border-gray-700 pt-2 mt-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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
  );
};

export default FriendChat;
