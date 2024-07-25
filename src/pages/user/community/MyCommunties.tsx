import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  UserGroupIcon,
  ArrowLeftIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import CreateCommunity from "./CreateCommunity";
import CommunityProfile from "./CommunityProfile";
import { getMycommunities, leaveCommunity } from "../../../api/community";

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
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  senderPicture: string;
}

const MyCommunities: React.FC = () => {
  const { userInfo } = useSelector((state: any) => state.userInfo);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCommunityProfile, setShowCommunityProfile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetchCommunities();
  }, []);

  useEffect(() => {
    if (selectedCommunity) {
      fetchMessages();
    }
  }, [selectedCommunity]);

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const response = await getMycommunities(userInfo.userId);

      if (response.status === 200 && response.data.myCommunities) {
        setCommunities(response.data.myCommunities);
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    // Dummy messages for now
    const dummyMessages: Message[] = [
      {
        id: "1",
        senderId: "user1",
        content: "Hello everyone!",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        senderPicture: "https://example.com/user1.jpg",
      },
      {
        id: "2",
        senderId: userInfo.userId,
        content: "Hi there! How's it going?",
        timestamp: new Date(Date.now() - 1000 * 60 * 4),
        senderPicture: userInfo.profilePicture,
      },
      {
        id: "3",
        senderId: "user2",
        content: "Great! Excited to be part of this community.",
        timestamp: new Date(Date.now() - 1000 * 60 * 3), // 3 minutes ago
        senderPicture: "https://example.com/user2.jpg",
      },
    ];
    setMessages(dummyMessages);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedCommunity) {
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

  const handleCreateCommunity = () => {
    setShowCreateForm(true);
    setSelectedCommunity(null);
    setShowCommunityProfile(false);
  };

  const handleBackClick = () => {
    setSelectedCommunity(null);
    setShowCreateForm(false);
    setShowCommunityProfile(false);
  };

  const handleCommunityCreated = () => {
    fetchCommunities();
    setShowCreateForm(false);
  };

  const toggleCommunityProfile = () => {
    setShowCommunityProfile(!showCommunityProfile);
  };

  const handleLeaveCommunity = async () => {
    if (selectedCommunity) {
      try {
        await leaveCommunity({
          userId: userInfo.userId,
          communityId: selectedCommunity._id,
        });
        toast.success(`You have left ${selectedCommunity.name}`);
        setCommunities(
          communities.filter((c) => c._id !== selectedCommunity._id)
        );
        setSelectedCommunity(null);
      } catch (error) {
        console.error("Error leaving community:", error);
        toast.error("Failed to leave community. Please try again.");
      }
    }
    setShowMenu(false);
  };

  const handleUpdateCommunity = async (updatedCommunity: Community) => {
    try {
      // TODO: Implement API call to update community
      // const response = await updateCommunity(updatedCommunity);

      // For now, we'll just update the local state
      setCommunities(
        communities.map((c) =>
          c._id === updatedCommunity._id ? updatedCommunity : c
        )
      );
      setSelectedCommunity(updatedCommunity);
      toast.success("Community updated successfully");
    } catch (error) {
      console.error("Error updating community:", error);
      toast.error("Failed to update community. Please try again.");
    }
  };

  return (
    <div className="mt-8 lg:mt-0 flex h-full ml-0 lg:ml-64 bg-black">
      <div
        className={`w-full lg:w-1/3 bg-black p-4 overflow-y-auto border-r border-gray-800 ${
          selectedCommunity || showCreateForm ? "hidden lg:block" : "block"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-2xl font-semibold">My Communities</h2>
          <button
            onClick={handleCreateCommunity}
            className="bg-[#ff5f09] text-white px-2 font-bold py-1 hover:bg-orange-700 focus:outline-none transition-colors"
          >
            +
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#ff5f09]"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {communities.map((community) => (
              <div
                key={community._id}
                className={`rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedCommunity?._id === community._id
                    ? "border-2 border-[#ff5f09]"
                    : "border border-gray-700"
                }`}
                onClick={() => {
                  setSelectedCommunity(community);
                  setShowCreateForm(false);
                  setShowCommunityProfile(false);
                }}
              >
                <div className="flex items-center">
                  <img
                    src={community.profilePicture || "default-avatar.png"}
                    alt={community.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-white text-lg font-semibold">
                      {community.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {community.description}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {community.hashtags.join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        className={`w-full lg:w-2/3 bg-black p-4 flex flex-col border-l border-gray-800 ${
          selectedCommunity || showCreateForm
            ? "block"
            : "hidden lg:flex lg:items-center lg:justify-center"
        }`}
      >
        {showCreateForm ? (
          <>
            <div className="flex items-center mb-4">
              <button
                onClick={handleBackClick}
                className="text-white hover:text-gray-300 mr-4"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <h3 className="text-white text-2xl font-semibold">
                Create Community
              </h3>
            </div>
            <CreateCommunity
              onClose={() => setShowCreateForm(false)}
              onCommunityCreated={handleCommunityCreated}
            />
          </>
        ) : selectedCommunity ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <button
                  onClick={handleBackClick}
                  className="text-white hover:text-gray-300 mr-4"
                >
                  <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={toggleCommunityProfile}
                >
                  <img
                    src={
                      selectedCommunity.profilePicture || "default-avatar.png"
                    }
                    alt={selectedCommunity.name}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <h3 className="text-white text-2xl font-semibold">
                    {selectedCommunity.name}
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
                community={selectedCommunity}
                onClose={() => setShowCommunityProfile(false)}
                onUpdate={handleUpdateCommunity}
              />
            ) : (
              <>
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
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <UserGroupIcon className="w-16 h-16 mb-4" />
            <p className="text-xl text-center mb-4">
              {communities.length > 0
                ? "Select or create a community to start chatting"
                : "Join or create a community to start chatting"}
            </p>
            <button
              onClick={handleCreateCommunity}
              className="bg-[#ff5f09] text-white px-6 py-2 rounded-lg hover:bg-orange-700 focus:outline-none transition-colors"
            >
              Create Community
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCommunities;
