import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  CheckIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  UserIcon,
  UserGroupIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import {
  getGlobalFriends,
  addFriend,
  getNearbyFriends,
} from "../../api/friends";
import { getCommunities, joinCommunity } from "../../api/community";

interface Friend {
  _id: string;
  userName: string;
  displayName: string;
  profilePicture: string | null;
  status: string;
  distance?: number;
}

interface Community {
  _id: string;
  name: string;
  description: string;
  profilePicture: string;
  hashtags: string[];
  isJoined?: boolean;
}

const FindFriends: React.FC = () => {
  const { userInfo } = useSelector((state: any) => state.userInfo);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [addedFriends, setAddedFriends] = useState<Set<string>>(new Set());
  const [joiningCommunity, setJoiningCommunity] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"friends" | "communities">(
    "friends"
  );
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [_nearbyFriends, setNearbyFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (activeTab === "friends") {
        fetchFriends(searchTerm);
      } else {
        fetchCommunities(searchTerm);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, userInfo.userId, activeTab]);

  const fetchFriends = async (search: string = "") => {
    setLoading(true);
    try {
      const response = await getGlobalFriends(userInfo.userId, search);
      if (response && response.data && response.data.users) {
        setFriends(response.data.users);
      } else {
        setFriends([]);
        if (search) {
          toast.error("No users found");
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch friends. Please try again later.");
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunities = async (search: string = "") => {
    setLoading(true);
    try {
      const response = await getCommunities(userInfo.userId, search);
      if (response.data.success) {
        setCommunities(response.data.data);
      } else {
        setCommunities([]);
        if (search) {
          toast.error("No communities found");
        } else {
          toast.error("Failed to fetch communities data");
        }
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
      toast.error("Failed to fetch communities. Please try again later.");
      setCommunities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (friendId: string) => {
    try {
      const response = await addFriend({ userId: userInfo.userId, friendId });
      if (response && response.status === 200) {
        toast.success("Friend added successfully!");
        setAddedFriends((prev) => new Set(prev).add(friendId));
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      toast.error("An error occurred while adding friend.");
    }
  };

  const handleJoinCommunity = async (communityId: string) => {
    setJoiningCommunity(communityId);
    try {
      const response = await joinCommunity({
        communityId,
        userId: userInfo.userId,
      });
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
        toast.error("Failed to join the community");
      }
    } catch (err) {
      toast.error("An error occurred while joining the community");
      console.error(err);
    } finally {
      setJoiningCommunity(null);
    }
  };

  const handleFindNearbyFriends = () => {
    setShowLocationModal(true);
  };

  const handleAllowLocation = () => {
    setShowLocationModal(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await getNearbyFriends({
              userId: userInfo.userId,
              latitude,
              longitude,
            });
            if (response.status === 200 && response.data.length > 0) {
              const nearbyFriendsData = response.data.map((friend: any) => ({
                _id: friend._id,
                userName: friend.userName,
                displayName: friend.displayName,
                profilePicture: friend.profilePicture,
                status: "Online",
                distance: friend.distance,
              }));
              setNearbyFriends(nearbyFriendsData);
              setFriends(nearbyFriendsData);
              setActiveTab("friends");
              toast.success("Nearby friends found!");
            } else {
              toast.error("No nearby friends found");
            }
          } catch (error) {
            console.error("Error fetching nearby friends:", error);
            toast.error(
              "Failed to fetch nearby friends. Please try again later."
            );
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Failed to get your location. Please try again.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };
  return (
    <div className="flex-1 ml-0 md:ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6 text-white">
          Find Friends and Communities
        </h1>

        <div className="flex flex-wrap mb-4 gap-2">
          <button
            className={`flex-grow md:flex-grow-0 px-4 py-2 rounded-lg ${
              activeTab === "friends"
                ? "bg-[#FF5F09] text-white"
                : "border border-gray-400 text-gray-300"
            }`}
            onClick={() => setActiveTab("friends")}
          >
            Friends
          </button>
          <button
            className={`flex-grow md:flex-grow-0 px-4 py-2 rounded-lg ${
              activeTab === "communities"
                ? "bg-[#FF5F09] text-white"
                : "border border-gray-400 text-gray-300"
            }`}
            onClick={() => setActiveTab("communities")}
          >
            Communities
          </button>
          <button
            className="flex-grow md:flex-grow-0 px-4 py-2 rounded-lg bg-[#FF5F09] text-white flex items-center justify-center"
            onClick={handleFindNearbyFriends}
          >
            <MapPinIcon className="w-5 h-5 mr-2" />
            Find Nearby
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg pl-10"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FF5F09]"></div>
          </div>
        ) : activeTab === "friends" ? (
          friends.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {friends.map((friend) => (
                <div
                  key={friend._id}
                  className="bg-gray-800 rounded-lg p-4 flex flex-col items-center"
                >
                  {friend.profilePicture ? (
                    <img
                      src={friend.profilePicture}
                      alt={friend.displayName}
                      className="w-24 h-24 rounded-full object-cover mb-2"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-2">
                      <UserIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <h3 className="text-white text-lg font-semibold text-center">
                    {friend.displayName}
                  </h3>
                  <p className="text-gray-400 text-sm text-center">
                    @{friend.userName}
                  </p>
                  <p
                    className={`text-sm mb-2 ${
                      friend.status === "Online"
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    {friend.status}
                  </p>
                  {friend.distance !== undefined && (
                    <p className="text-gray-400 text-sm mb-2">
                      {friend.distance.toFixed(2)} km away
                    </p>
                  )}
                  <button
                    onClick={() => handleAddFriend(friend._id)}
                    className={`p-2 rounded-full transition-colors ${
                      addedFriends.has(friend._id)
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-[#FF5F09] hover:bg-orange-600"
                    }`}
                  >
                    {addedFriends.has(friend._id) ? (
                      <CheckIcon className="w-5 h-5 text-white" />
                    ) : (
                      <PlusIcon className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-64 bg-gray-800 rounded-lg">
              <UserIcon className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-white text-lg font-semibold">No users found</p>
              <p className="text-gray-400 text-sm mt-2 text-center">
                {searchTerm
                  ? "Try a different search term"
                  : "No friends available at the moment"}
              </p>
            </div>
          )
        ) : communities.length > 0 ? (
          <div className="space-y-4">
            {communities.map((community) => (
              <div
                key={community._id}
                className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 rounded-md border-2 border-gray-600 p-3"
              >
                <img
                  src={community.profilePicture}
                  alt={community.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-white font-semibold">{community.name}</h3>
                  <p className="text-gray-300 text-sm">
                    {community.description}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {community.hashtags.map((tag) => `#${tag}`).join(", ")}
                  </p>
                </div>
                <button
                  className={`bg-[#FF5F09] text-white p-2 rounded-full hover:bg-orange-600 transition-colors flex items-center ${
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
        ) : (
          <div className="flex flex-col justify-center items-center h-64 bg-gray-800 rounded-lg">
            <UserGroupIcon className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-white text-lg font-semibold">
              No communities found
            </p>
            <p className="text-gray-400 text-sm mt-2 text-center">
              {searchTerm
                ? "Try a different search term"
                : "No communities available at the moment"}
            </p>
          </div>
        )}
      </div>

      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-white text-xl font-semibold mb-4">
              Allow Location Access
            </h2>
            <p className="text-gray-300 mb-4">
              To find nearby friends, we need access to your location. Do you
              want to allow this?
            </p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-lg mr-2"
                onClick={() => setShowLocationModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#FF5F09] text-white rounded-lg"
                onClick={handleAllowLocation}
              >
                Allow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindFriends;
