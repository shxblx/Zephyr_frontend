import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { UserGroupIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import CreateCommunity from "./CreateCommunity";
import { createCommunity } from "../../../api/community";

interface Community {
  _id: string;
  name: string;
  description: string;
  memberCount: number;
  avatar: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  senderPicture: string;
}

interface UserInfo {
  userId: string;
  profilePicture: string;
}

interface RootState {
  userInfo: {
    userInfo: UserInfo;
  };
}

const MyCommunities: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.userInfo);
  const [communities, setCommunities] = useState<Community[]>([
    {
      _id: "1",
      name: "QuestForge",
      description: "A community for React developers",
      memberCount: 1500,
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTKfps2BYcm1T7oD3XmKS1DLeOLuNm13f2xQ&s",
    },
    {
      _id: "2",
      name: "Epic Guild",
      description: "Learn and discuss TypeScript",
      memberCount: 800,
      avatar:
        "https://i0.wp.com/quanticfoundry.com/wp-content/uploads/2015/07/photodune-9235903-game-m-16x9.jpg?fit=1280%2C721&ssl=1",
    },
    {
      _id: "3",
      name: "Pixel Warriors",
      description: "Share and discover web design ideas",
      memberCount: 2200,
      avatar:
        "https://i.pinimg.com/564x/bd/7a/96/bd7a962eca93ed43fbdc42525927d5d2.jpg",
    },
  ]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

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
    // Simulating API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const fetchMessages = () => {
    // Simulate fetching messages for the selected community
    const dummyMessages: Message[] = [
      {
        id: "1",
        senderId: "user1",
        content: "Hello everyone! Excited to be part of this community!",
        timestamp: new Date(Date.now() - 300000),
        senderPicture: "https://example.com/user1-avatar.png",
      },
      {
        id: "2",
        senderId: "user2",
        content: "Welcome! Glad to have you here.",
        timestamp: new Date(Date.now() - 240000),
        senderPicture: "https://example.com/user2-avatar.png",
      },
      {
        id: "3",
        senderId: userInfo.userId,
        content: "Thanks for the warm welcome!",
        timestamp: new Date(Date.now() - 180000),
        senderPicture: userInfo.profilePicture,
      },
      {
        id: "4",
        senderId: "user3",
        content: "Has anyone worked on any interesting projects lately?",
        timestamp: new Date(Date.now() - 120000),
        senderPicture: "https://example.com/user3-avatar.png",
      },
    ];
    setMessages(dummyMessages);
  };

  const handleSendMessage = () => {
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
  };

  const handleBackClick = () => {
    setSelectedCommunity(null);
    setShowCreateForm(false);
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
            className="bg-[#ff5f09] text-white px-4 py-2 rounded-lg hover:bg-orange-700 focus:outline-none transition-colors"
          >
            Create Community
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
                }}
              >
                <div className="flex items-center">
                  <img
                    src={community.avatar}
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
                      {community.memberCount} members
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
            <CreateCommunity />
          </>
        ) : selectedCommunity ? (
          <>
            <div className="flex items-center mb-4">
              <button
                onClick={handleBackClick}
                className="text-white hover:text-gray-300 mr-4"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <h3 className="text-white text-2xl font-semibold">
                {selectedCommunity.name}
              </h3>
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
            <UserGroupIcon className="w-16 h-16 mb-4" />
            <p className="text-xl text-center mb-4">
              {communities.length > 0
                ? "Select a community to start chatting"
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