import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import {
  leaveCommunity,
  sendCommunityMessage,
  getCommunityMessages,
  reportCommunity,
  sendFileToCommunity,
} from "../../../api/community";
import socket from "../../../components/common/socket";
import CommunityProfile from "./CommunityProfile";

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
  fileUrl?: string;
  fileType?: "image" | "video";
}

interface CommunityProps {
  community: Community;
  userInfo: any;
  onBackClick: () => void;
  onNewMessage: (message: Message) => void;
}

const CommunityChat: React.FC<CommunityProps> = ({
  community,
  userInfo,
  onBackClick,
  onNewMessage,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSubject, setReportSubject] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [showCommunityProfile, setShowCommunityProfile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMessages();
    socket.emit("joinCommunity", { communityId: community._id });

    socket.on("newCommunityMessage", handleNewMessage);

    return () => {
      socket.emit("leaveCommunity", { communityId: community._id });
      socket.off("newCommunityMessage", handleNewMessage);
    };
  }, [community._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await getCommunityMessages(community._id);
      if (response.status === 200 && response.data) {
        setMessages(
          response.data.sort(
            (a: Message, b: Message) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
        );
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewMessage = (message: Message) => {
    setMessages((prevMessages) => {
      if (!prevMessages.some((m) => m._id === message._id)) {
        return [...prevMessages, message];
      }
      return prevMessages;
    });
    onNewMessage(message);
  };

  const handleSendMessage = async () => {
    if ((newMessage.trim() || selectedFile) && !isSending) {
      setIsSending(true);
      let fileUrl = "";
      let fileType: "image" | "video" | undefined = undefined;

      if (selectedFile) {
        setIsUploading(true);
        try {
          const formData = new FormData();
          formData.append("selectedFile", selectedFile);

          const uploadResponse = await sendFileToCommunity(formData);
          console.log(uploadResponse);

          fileUrl = uploadResponse.data.fileUrl;
          fileType = selectedFile.type.startsWith("image/") ? "image" : "video";
        } catch (error) {
          console.error("Error uploading file:", error);
          toast.error("Failed to upload file. Please try again.");
          setIsUploading(false);
          setIsSending(false);
          return;
        }
        setIsUploading(false);
      }

      const messageData = {
        communityId: community._id,
        sender: userInfo.userId,
        userName: userInfo.userName,
        profilePicture: userInfo.profile,
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        fileUrl,
        fileType,
      };

      try {
        const response = await sendCommunityMessage(messageData);
        const sentMessage: Message = {
          _id: response._id,
          ...messageData,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt,
        };

        setMessages((prevMessages) => [...prevMessages, sentMessage]);
        socket.emit("sendCommunityMessage", {
          communityId: community._id,
          message: sentMessage,
        });

        setNewMessage("");
        setSelectedFile(null);
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message. Please try again.");
      } finally {
        setIsSending(false);
      }
    }
  };
  const handleLeaveCommunity = async () => {
    try {
      await leaveCommunity({
        userId: userInfo.userId,
        communityId: community._id,
      });
      toast.success(`You have left ${community.name}`);
      onBackClick();
    } catch (error) {
      console.error("Error leaving community:", error);
      toast.error("Failed to leave community. Please try again.");
    }
    setShowMenu(false);
  };

  const handleReportCommunity = () => {
    setShowReportModal(true);
    setShowMenu(false);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const toggleCommunityProfile = () => {
    setShowCommunityProfile(!showCommunityProfile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const openFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] relative">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
          <button
            onClick={onBackClick}
            className="text-white hover:text-gray-300 mr-4"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={toggleCommunityProfile}
            className="flex items-center"
          >
            <img
              src={community.profilePicture || "/default-avatar.png"}
              alt={community.name}
              className="w-10 h-10 rounded-full object-cover mr-2"
            />
            <h3 className="text-white text-2xl font-semibold">
              {community.name}
            </h3>
          </button>
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
      <div className="flex-grow overflow-y-auto p-4 pb-24 scrollbar-hide">
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
                {message.fileUrl && (
                  <div className="mb-2">
                    {message.fileType === "image" ? (
                      <img
                        src={message.fileUrl}
                        alt="Shared image"
                        className="max-w-xs rounded-lg"
                      />
                    ) : (
                      <video
                        src={message.fileUrl}
                        controls
                        className="max-w-xs rounded-lg"
                      />
                    )}
                  </div>
                )}
                {message.content && (
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      message.sender === userInfo.userId
                        ? "bg-[#ff5f09] text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {message.content}
                  </span>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
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
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-700 bg-black p-4 mb-12 md:mb-0">
        <div className="flex items-center">
          <button
            onClick={openFileInput}
            className="bg-gray-800 text-white p-2 rounded-l-lg hover:bg-gray-700 focus:outline-none transition-colors"
          >
            <PaperClipIcon className="w-6 h-6" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,video/*"
            className="hidden"
          />
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-grow bg-gray-800 text-white px-4 py-2 focus:outline-none border border-gray-700"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            disabled={isSending || isUploading}
            className="bg-[#ff5f09] text-white px-6 py-2 rounded-r-lg hover:bg-orange-700 focus:outline-none transition-colors disabled:bg-gray-500 flex items-center justify-center"
          >
            {isSending || isUploading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Send"
            )}
          </button>
        </div>
        {selectedFile && (
          <div className="mt-2 text-sm text-gray-300">
            Selected file: {selectedFile.name}
          </div>
        )}
      </div>
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-black text-xl font-bold">Report Community</h2>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="text-black text-sm block mb-1">Subject</label>
                <input
                  type="text"
                  value={reportSubject}
                  onChange={(e) => setReportSubject(e.target.value)}
                  className="w-full bg-gray-100 text-black text-sm px-2 py-1"
                  required
                />
              </div>
              <div>
                <label className="text-black text-sm block mb-1">Reason</label>
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-gray-100 text-black text-sm px-2 py-1 h-32 resize-none"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#ff5f09] text-white text-sm px-4 py-1 rounded hover:bg-orange-700 focus:outline-none transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showCommunityProfile && (
        <CommunityProfile
          community={community}
          onClose={toggleCommunityProfile}
          onUpdate={() => {}}
        />
      )}
    </div>
  );
};

export default CommunityChat;
