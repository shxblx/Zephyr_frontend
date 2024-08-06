import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  UserPlusIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  UserIcon, // Importing UserIcon from Heroicons for default profile icon
} from "@heroicons/react/24/outline";
import { addFriend, getGlobalFriends } from "../../../api/friends";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

interface Friend {
  _id: string;
  userName: string;
  displayName: string;
  profilePicture: string | null;
}

const FriendSuggestions: React.FC = () => {
  const { userInfo } = useSelector((state: any) => state.userInfo);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentFriendIndex, setCurrentFriendIndex] = useState(0);
  const [addedFriends, setAddedFriends] = useState<Set<string>>(new Set());
  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getGlobalFriends(userInfo.userId);
        console.log(response);

        if (response && response.data && response.data.users) {
          const filteredFriends = response.data.users.filter(
            (friend: Friend) => friend._id !== userInfo.userId
          );
          setFriends(filteredFriends);
        } else {
          toast.error("Failed to fetch friends data");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [userInfo.userId]);

  const nextFriend = () => {
    setCurrentFriendIndex((prevIndex) =>
      prevIndex === friends.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevFriend = () => {
    setCurrentFriendIndex((prevIndex) =>
      prevIndex === 0 ? friends.length - 1 : prevIndex - 1
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.touches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextFriend();
      } else {
        prevFriend();
      }
      touchStartX.current = null;
    }
  };

  const handleAddFriend = async (friendId: string) => {
    try {
      const response = await addFriend({ userId: userInfo.userId, friendId });
      if (response && response.status === 200) {
        toast.success(response.data);
        setAddedFriends((prev) => new Set(prev).add(friendId));
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      toast.error("An error occurred while adding friend.");
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart as any);
      container.addEventListener("touchmove", handleTouchMove as any);
      container.addEventListener("touchend", handleTouchEnd as any);
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart as any);
        container.removeEventListener("touchmove", handleTouchMove as any);
        container.removeEventListener("touchend", handleTouchEnd as any);
      }
    };
  }, []);

  return (
    <div className="p-4 mb-4 border-2 border-gray-600">
      <h2 className="text-white text-xl font-semibold mb-4 flex items-center">
        <UserPlusIcon className="w-6 h-6 mr-2" />
        Friend Suggestions
      </h2>
      {loading ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 bg-gray-700 rounded-full animate-pulse"></div>
          <div className="w-32 h-4 bg-gray-700 rounded animate-pulse"></div>
          <div className="w-24 h-4 bg-gray-700 rounded animate-pulse"></div>
          <div className="w-36 h-8 bg-gray-700 rounded-full animate-pulse mt-2"></div>
          <div className="text-gray-400 mt-2">Fetching users...</div>
        </div>
      ) : friends.length === 0 ? (
        <div>No friend suggestions available.</div>
      ) : (
        <div
          ref={containerRef}
          className="relative h-64 overflow-hidden touch-pan-y"
        >
          <div className="flex justify-center items-center h-full">
            {friends.map((friend, index) => {
              const isCenter = index === currentFriendIndex;
              const isLeft =
                index ===
                (currentFriendIndex - 1 + friends.length) % friends.length;
              const isRight =
                index === (currentFriendIndex + 1) % friends.length;

              return (
                <div
                  key={friend._id}
                  className={`absolute transition-all duration-300 ${
                    isCenter
                      ? "opacity-100 scale-100 z-20"
                      : isRight
                      ? "opacity-50 scale-75 translate-x-32 z-10"
                      : isLeft
                      ? "opacity-50 scale-75 -translate-x-32 z-10"
                      : "opacity-0 scale-50 z-0"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    {friend.profilePicture ? (
                      <img
                        src={friend.profilePicture}
                        alt={friend.displayName}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-ff5f09 rounded-full flex items-center justify-center">
                        <UserIcon className="w-12 h-12 text-white" />
                      </div>
                    )}
                    <h3 className="text-white text-lg font-semibold text-center">
                      {friend.displayName}
                    </h3>
                    <p className="text-gray-300 text-sm text-center">
                      @{friend.userName}
                    </p>
                    {isCenter && (
                      <button
                        onClick={() => handleAddFriend(friend._id)}
                        className={`p-2 rounded-full transition-colors ${
                          addedFriends.has(friend._id)
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-[#ff5f09] hover:bg-orange-600"
                        }`}
                      >
                        {addedFriends.has(friend._id) ? (
                          <CheckIcon className="w-5 h-5 text-white" />
                        ) : (
                          <PlusIcon className="w-5 h-5 text-white" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={prevFriend}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#ff5f09] text-white p-2 rounded-full hover:bg-orange-600 transition-colors z-30"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={nextFriend}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#ff5f09] text-white p-2 rounded-full hover:bg-orange-600 transition-colors z-30"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>
      )}
      <div className="flex justify-center mt-4">
        <Link
          to="/findfriends"
          className="inline-block text-white px-4 py-2 text-sm bg-[#ff5f09] hover:bg-orange-600 transition-colors rounded"
        >
          View All
        </Link>
      </div>
    </div>
  );
};

export default FriendSuggestions;
