import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserGroupIcon, PlusIcon, UserIcon } from "@heroicons/react/24/outline";
import { getCommunities, joinCommunity } from "../../../api/community";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

interface Community {
  _id: string;
  name: string;
  description: string;
  profilePicture: string;
  createdAt: string;
  createdBy: {
    _id: string;
  };
  hashtags: string[];
  isPrivate: boolean;
  isJoined?: boolean;
}

const Communities: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joiningCommunity, setJoiningCommunity] = useState<string | null>(null);
  const { userInfo } = useSelector((state: any) => state.userInfo);

  let userId = userInfo.userId;

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await getCommunities(userId);
        if (response.data.success) {
          setCommunities(response.data.data);
        } else {
          setError("Failed to fetch communities");
        }

        if(response.status===403){
          
        }
      } catch (err) {
        setError("An error occurred while fetching communities");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [userId]);

  const handleJoinCommunity = async (communityId: string) => {
    setJoiningCommunity(communityId);
    try {
      const response = await joinCommunity({ communityId, userId });
      if (response.status === 200) {
        setCommunities(
          communities.map((community) =>
            community._id === communityId
              ? { ...community, isJoined: true }
              : community
          )
        );
        toast.success(response.data);
      } else {
        setError("Failed to join the community");
      }
    } catch (err) {
      setError("An error occurred while joining the community");
      console.error(err);
    } finally {
      setJoiningCommunity(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4 mb-4 border-2 border-gray-600">
        <h2 className="text-white text-xl font-semibold mb-4 flex items-center">
          <UserGroupIcon className="w-6 h-6 mr-2" />
          Communities
        </h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 rounded-md border-2 border-gray-600 p-3"
            >
              <div className="w-16 h-16 bg-gray-700 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="w-3/4 h-4 bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="w-full h-3 bg-gray-700 rounded animate-pulse mb-1"></div>
                <div className="w-2/3 h-3 bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="w-20 h-8 bg-gray-700 rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="text-gray-400 mt-4">Fetching communities...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 mb-4 border-2 border-gray-600">
      <h2 className="text-white text-xl font-semibold mb-4 flex items-center">
        <UserGroupIcon className="w-6 h-6 mr-2" />
        Communities
      </h2>
      <div className="space-y-4">
        {communities.map((community) => (
          <div
            key={community._id}
            className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 rounded-md border-2 border-gray-600 p-3"
          >
            {community.profilePicture ? (
              <img
                src={community.profilePicture}
                alt={community.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-ff5f09 rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
            )}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-white font-semibold">{community.name}</h3>
              <p className="text-gray-300 text-sm">{community.description}</p>
              <p className="text-gray-400 text-xs mt-1">
                {community.hashtags.map((tag) => `#${tag}`).join(", ")}
              </p>
            </div>
            <button
              className={`bg-ff5f09 text-white p-2 rounded-full hover:bg-ff5f09 transition-colors flex items-center ${
                joiningCommunity === community._id
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() => handleJoinCommunity(community._id)}
              disabled={
                joiningCommunity === community._id || community.isJoined
              }
            >
              <PlusIcon className="w-5 h-5 mr-1" />
              {joiningCommunity === community._id
                ? "Joining..."
                : community.isJoined
                ? "Joined"
                : "Join"}
            </button>
          </div>
        ))}
      </div>
      <Link
        to="/findfriends"
        className="mt-4 inline-block text-white px-4 py-2 text-sm bg-ff5f09 hover:bg-orange-600 transition-colors rounded"
      >
        View All Communities
      </Link>
    </div>
  );
};

export default Communities;
