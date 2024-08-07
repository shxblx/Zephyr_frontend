import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import {
  removeFriend,
  sendMessage,
  fetchMessages,
  reportUser,
} from "../../../api/friends";
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
  _id: string;
  conversationId: string;
  sender: string;
  content: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
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
  const [isLoading, setIsLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSubject, setReportSubject] = useState("");
  const [reportReason, setReportReason] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedFriend && userInfo) {
      const newRoomId = [userInfo.userId, selectedFriend._id].sort().join("-");
      setRoomId(newRoomId);

      const fetchMessagesFromBackend = async () => {
        setIsLoading(true);
        try {
          const response = await fetchMessages(
            userInfo.userId,
            selectedFriend._id
          );
          setMessages(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          console.error("Error fetching messages:", error);
          toast.error("Failed to load messages. Please try again.");
          setMessages([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchMessagesFromBackend();

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
          _id: response._id || Date.now().toString(),
          conversationId: response.conversationId || roomId,
          sender: userInfo.userId,
          content: newMessage.trim(),
          timestamp: response.timestamp || new Date().toISOString(),
          createdAt: response.createdAt || new Date().toISOString(),
          updatedAt: response.updatedAt || new Date().toISOString(),
          __v: response.__v || 0,
        };

        socket.emit("sendMessage", { room: roomId, message });

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

  const handleReportUser = () => {
    setShowReportModal(true);
    setShowMenu(false);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFriend) return;

    try {
      const response = await reportUser({
        reporterId: userInfo.userId,
        reportedUserId: selectedFriend._id,
        subject: reportSubject,
        reason: reportReason,
      });

      if (response.status === 200) {
        setShowReportModal(false);
        toast.success("Report submitted successfully");
        setReportSubject("");
        setReportReason("");
      } else {
        toast.error("Failed to submit report");
      }
    } catch (error) {
      console.error("Error reporting user:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 ">
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
                <li>
                  <button
                    onClick={handleReportUser}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Report User
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <div
        className="flex-grow overflow-y-auto p-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {isLoading ? (
          <div className="text-white text-center">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-white text-center">No messages yet</div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex items-start mb-4 ${
                message.sender === userInfo.userId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {message.sender !== userInfo.userId && (
                <img
                  src={selectedFriend?.profilePicture}
                  alt="Sender"
                  className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
                />
              )}
              <div
                className={`flex flex-col ${
                  message.sender === userInfo.userId
                    ? "items-end"
                    : "items-start"
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === userInfo.userId
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
              {message.sender === userInfo.userId && (
                <img
                  src={userInfo.profile}
                  alt="Sender"
                  className="w-8 h-8 rounded-full ml-2 flex-shrink-0"
                />
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex border-t border-gray-700 p-4 ">
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

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 rounded-lg p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-2xl font-bold">Report User</h2>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleReportSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="reportSubject"
                  className="block text-gray-300 mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="reportSubject"
                  value={reportSubject}
                  onChange={(e) => setReportSubject(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ff5f09"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="reportReason"
                  className="block text-gray-300 mb-2"
                >
                  Reason
                </label>
                <textarea
                  id="reportReason"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-ff5f09"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-ff5f09 text-white py-2 px-4 rounded-lg hover:bg-orange-700 focus:outline-none transition-colors duration-300"
              >
                Submit Report
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendChat;
