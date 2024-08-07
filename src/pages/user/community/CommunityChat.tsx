import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import CommunityProfile from "./CommunityProfile";
import {
  getCommunityById,
  leaveCommunity,
  sendCommunityMessage,
  getCommunityMessages,
  reportCommunity,
} from "../../../api/community";
import socket from "../../../components/common/socket";

interface Community {
  _id: string;
  name: string;
  description: string;
  hashtags: string[];
  isPrivate: boolean;
  profilePicture: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  _id: string;
  communityId: string;
  sender: string;
  userName: string;
  profilePicture: string;
  content: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

const CommunityChat: React.FC = () => {
  const { userInfo } = useSelector((state: any) => state.userInfo);
  const { communityId } = useParams<{ communityId: string }>();
  const [community, setCommunity] = useState<Community | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showCommunityProfile, setShowCommunityProfile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSubject, setReportSubject] = useState("");
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    if (communityId) {
      fetchCommunity();
      fetchMessages();

      socket.emit("joinCommunity", { communityId });

      socket.on("newCommunityMessage", (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.emit("leaveCommunity", { communityId });
        socket.off("newCommunityMessage");
      };
    }
  }, [communityId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchCommunity = async () => {
    if (!communityId) return;
    try {
      const response = await getCommunityById(communityId);
      if (response.status === 200 && response.data) {
        setCommunity(response.data);
      }
    } catch (error) {
      console.error("Error fetching community:", error);
      toast.error("Failed to load community. Please try again.");
    }
  };

  const fetchMessages = async () => {
    if (!communityId) return;
    setIsLoading(true);
    try {
      const response = await getCommunityMessages(communityId);
      if (response.status === 200 && response.data) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && community) {
      const messageData = {
        communityId: community._id,
        sender: userInfo.userId,
        userName: userInfo.userName,
        profilePicture: userInfo.profile,
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
      };

      try {
        await sendCommunityMessage(messageData);

        const message: Message = {
          _id: Date.now().toString(),
          ...messageData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        socket.emit("sendCommunityMessage", {
          communityId,
          message,
        });

        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message. Please try again.");
      }
    }
  };

  const toggleCommunityProfile = () => {
    setShowCommunityProfile(!showCommunityProfile);
  };

  const handleLeaveCommunity = async () => {
    if (community) {
      const communityName = community.name;
      try {
        await leaveCommunity({
          userId: userInfo.userId,
          communityId: community._id,
        });
        toast.success(`You have left ${communityName}`);
        window.location.href = "/communities";
      } catch (error) {
        console.error("Error leaving community:", error);
        toast.error("Failed to leave community. Please try again.");
      }
    }
    setShowMenu(false);
  };

  const handleUpdateCommunity = async (updatedCommunity: Community) => {
    setCommunity(updatedCommunity);
    toast.success("Community updated successfully");
  };

  const handleReportCommunity = () => {
    setShowReportModal(true);
    setShowMenu(false);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!community) return;

    try {
      const response = await reportCommunity({
        reporterId: userInfo.userId,
        reportedCommunityId: community._id,
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
      console.error("Error reporting community:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  if (!community) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="flex h-screen ml-0 lg:ml-64 bg-black">
      <div className="w-full bg-black flex flex-col border-l border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/communities"
                className="text-white hover:text-gray-300 mr-4"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </Link>
              <div
                className="flex items-center cursor-pointer"
                onClick={toggleCommunityProfile}
              >
                <img
                  src={community.profilePicture || "/default-avatar.png"}
                  alt={community.name}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <h3 className="text-white text-2xl font-semibold">
                  {community.name}
                </h3>
              </div>
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
                        onClick={handleLeaveCommunity}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        Leave Community
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleReportCommunity}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        Report Community
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        {showCommunityProfile ? (
          <div className="flex-grow overflow-hidden">
            <CommunityProfile
              community={community}
              onClose={() => setShowCommunityProfile(false)}
              onUpdate={handleUpdateCommunity}
            />
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-grow overflow-hidden">
              <div className="h-full overflow-y-auto scrollbar-hide p-4">
                {isLoading ? (
                  <div className="text-white text-center">
                    Loading messages...
                  </div>
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
                          src={message.profilePicture || "/default-avatar.png"}
                          alt={message.userName}
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
                        {message.sender !== userInfo.userId && (
                          <span className="text-sm text-gray-400 mb-1">
                            {message.userName}
                          </span>
                        )}
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
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      {message.sender === userInfo.userId && (
                        <img
                          src={userInfo.profile || "/default-avatar.png"}
                          alt={userInfo.userName}
                          className="w-8 h-8 rounded-full ml-2 flex-shrink-0"
                        />
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="p-4 border-t border-gray-800">
              <div className="flex">
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
            </div>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 rounded-lg p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-2xl font-bold">
                Report Community
              </h2>
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

export default CommunityChat;
