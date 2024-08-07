import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import CommunityProfile from "./CommunityProfile";
import {
  getCommunityById,
  leaveCommunity,
  sendCommunityMessage,
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
  sender: {
    _id: string;
    userName: string;
    profilePicture: string;
  };
  content: string;
  timestamp: string;
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

  useEffect(() => {
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
  }, [communityId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchCommunity = async () => {
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
    setIsLoading(true);
    try {
      const response = await fetch(`/api/community/${communityId}/messages`);
      const data = await response.json();
      setMessages(data);
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
        profilePicture: userInfo.profilePicture,
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
      };

      try {
        const response = await sendCommunityMessage();
        const savedMessage = await response.json();

        socket.emit("sendCommunityMessage", {
          communityId,
          message: savedMessage,
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
      try {
        await leaveCommunity({
          userId: userInfo.userId,
          communityId: community._id,
        });
        toast.success(`You have left ${community.name}`);
        window.location.href = "/my-communities";
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

  if (!community) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-full ml-0 lg:ml-64 bg-black">
      <div className="w-full bg-black p-4 flex flex-col border-l border-gray-800">
        <div className="flex items-center justify-between mb-4">
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
                src={community.profilePicture || "default-avatar.png"}
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
                </ul>
              </div>
            )}
          </div>
        </div>
        {showCommunityProfile ? (
          <CommunityProfile
            community={community}
            onClose={() => setShowCommunityProfile(false)}
            onUpdate={handleUpdateCommunity}
          />
        ) : (
          <>
            <div className="flex-grow overflow-y-auto mb-4 border border-gray-700 rounded-lg p-4">
              {isLoading ? (
                <div className="text-white text-center">
                  Loading messages...
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex items-start mb-4 ${
                      message.sender._id === userInfo.userId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {message.sender._id !== userInfo.userId && (
                      <img
                        src={
                          message.sender.profilePicture || "default-avatar.png"
                        }
                        alt="Sender"
                        className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
                      />
                    )}
                    <div
                      className={`flex flex-col ${
                        message.sender._id === userInfo.userId
                          ? "items-end"
                          : "items-start"
                      }`}
                    >
                      <span
                        className={`inline-block p-2 rounded-lg ${
                          message.sender._id === userInfo.userId
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
                    {message.sender._id === userInfo.userId && (
                      <img
                        src={userInfo.profilePicture || "default-avatar.png"}
                        alt="Sender"
                        className="w-8 h-8 rounded-full ml-2 flex-shrink-0"
                      />
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex border-t border-gray-700 pt-2 mt-2 mb-20 lg:mb-8">
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
        )}
      </div>
    </div>
  );
};

export default CommunityChat;
