import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import CreateCommunity from "./CreateCommunity";
import CommunityChat from "./CommunityChat";
import { getMycommunities, getCommunityMessages } from "../../../api/community";
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
  lastMessage?: {
    content: string;
    sender: string;
    userName: string;
    timestamp: string;
  };
}

const MyCommunities: React.FC = () => {
  const { userInfo } = useSelector((state: any) => state.userInfo);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchCommunities();
    const storedCommunity = localStorage.getItem("selectedCommunity");
    if (storedCommunity) {
      setSelectedCommunity(JSON.parse(storedCommunity));
    }

    socket.on("newCommunityMessage", handleNewMessage);

    return () => {
      socket.off("newCommunityMessage", handleNewMessage);
    };
  }, []);

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const response = await getMycommunities(userInfo.userId);
      if (response.status === 200 && response.data.myCommunities) {
        const communitiesWithLastMessage = await Promise.all(
          response.data.myCommunities.map(async (community: Community) => {
            const messages = await getCommunityMessages(community._id);
            const lastMessage = messages.data[0];
            return {
              ...community,
              lastMessage: lastMessage ? {
                content: lastMessage.content,
                sender: lastMessage.sender,
                userName: lastMessage.userName,
                timestamp: lastMessage.timestamp,
              } : undefined,
            };
          })
        );
        setCommunities(sortCommunitiesByLastMessage(communitiesWithLastMessage));
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
      toast.error("Failed to load communities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sortCommunitiesByLastMessage = (communities: Community[]) => {
    return communities.sort((a, b) => {
      if (!a.lastMessage && !b.lastMessage) return 0;
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
    });
  };

  const handleNewMessage = (message: any) => {
    setCommunities((prevCommunities) => {
      const updatedCommunities = prevCommunities.map((community) => {
        if (community._id === message.communityId) {
          return {
            ...community,
            lastMessage: {
              content: message.content,
              sender: message.sender,
              userName: message.userName,
              timestamp: message.timestamp,
            },
          };
        }
        return community;
      });
      return sortCommunitiesByLastMessage(updatedCommunities);
    });
  };

  const handleSelectCommunity = (community: Community) => {
    setSelectedCommunity(community);
    localStorage.setItem("selectedCommunity", JSON.stringify(community));
  };

  const handleBackClick = () => {
    setSelectedCommunity(null);
    localStorage.removeItem("selectedCommunity");
  };

  const handleCreateCommunity = () => {
    setShowCreateForm(true);
  };

  const handleCommunityCreated = () => {
    fetchCommunities();
    setShowCreateForm(false);
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] ml-0 lg:ml-64 bg-black overflow-hidden">
      <div
        className={`w-full lg:w-1/3 bg-black border-r border-gray-800 flex flex-col ${
          selectedCommunity ? "hidden lg:flex" : "flex"
        }`}
      >
        <div className="flex justify-between items-center p-4">
          <h2 className="text-white text-2xl font-semibold">My Communities</h2>
          <button
            onClick={handleCreateCommunity}
            className="bg-[#ff5f09] text-white px-4 py-2 rounded-lg hover:bg-orange-700 focus:outline-none transition-colors"
          >
            Create Community
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#ff5f09]"></div>
            </div>
          ) : communities.length > 0 ? (
            <div className="space-y-4 p-4">
              {communities.map((community) => (
                <div
                  key={community._id}
                  className={`rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedCommunity?._id === community._id
                      ? "border-2 border-[#ff5f09]"
                      : "border border-gray-700"
                  }`}
                  onClick={() => handleSelectCommunity(community)}
                >
                  <div className="flex items-center">
                    <img
                      src={community.profilePicture || "/default-avatar.png"}
                      alt={community.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="text-white text-lg font-semibold">
                        {community.name}
                      </h3>
                      {community.lastMessage ? (
                        <div>
                          <p className="text-gray-400 text-sm truncate">
                            {community.lastMessage.userName}: {community.lastMessage.content}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {new Date(community.lastMessage.timestamp).toLocaleString()}
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
              <p className="text-xl text-center">Create a community to get started</p>
            </div>
          )}
        </div>
      </div>
      <div
        className={`w-full lg:w-2/3 bg-black flex flex-col border-l border-gray-800 ${
          selectedCommunity
            ? "flex"
            : "hidden lg:flex lg:items-center lg:justify-center"
        }`}
      >
        {selectedCommunity ? (
          <CommunityChat
            community={selectedCommunity}
            userInfo={userInfo}
            onBackClick={handleBackClick}
            onNewMessage={handleNewMessage}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <UserGroupIcon className="w-16 h-16 mb-4" />
            <p className="text-xl text-center">
              {communities.length > 0
                ? "Choose a community to start chatting"
                : "Create a community to start chatting"}
            </p>
          </div>
        )}
      </div>
      {showCreateForm && (
        <CreateCommunity
          onClose={() => setShowCreateForm(false)}
          onCommunityCreated={handleCommunityCreated}
        />
      )}
    </div>
  );
};

export default MyCommunities;