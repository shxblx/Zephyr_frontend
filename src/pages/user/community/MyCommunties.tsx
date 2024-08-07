import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import CreateCommunity from "./CreateCommunity";
import { getMycommunities } from "../../../api/community";

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

const MyCommunities: React.FC = () => {
  const { userInfo } = useSelector((state: any) => state.userInfo);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchCommunities();
  }, []);

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

  const handleCreateCommunity = () => {
    setShowCreateForm(true);
  };

  const handleCommunityCreated = () => {
    fetchCommunities();
    setShowCreateForm(false);
  };

  return (
    <div className="mt-24 lg:mt-12 flex h-full ml-0 lg:ml-64 bg-black">
      <div className="w-full lg:w-1/3 bg-black p-4 overflow-y-auto border-r border-gray-800">
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
              <Link
                key={community._id}
                to={`/community/${community._id}`}
                className="block rounded-lg p-4 cursor-pointer transition-colors border border-gray-700 hover:border-[#ff5f09]"
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
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="w-full lg:w-2/3 bg-black p-4 flex flex-col border-l border-gray-800 hidden lg:flex lg:items-center lg:justify-center">
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
