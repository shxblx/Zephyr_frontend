import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Cog6ToothIcon,
  EyeIcon,
  PencilIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { setUserInfo } from "../../redux/slices/userSlice/userSlice";
import { changeProfile, changeStatus } from "../../api/user";
import { getMycommunities } from "../../api/community";
import { getFriends } from "../../api/friends";
import Loader from "../../components/common/user/Loader";

interface UserInfo {
  displayName: string;
  userName: string;
  email: string;
  profile: string;
  status: string;
  joined_date: string;
  userId: string;
}

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

interface Friend {
  _id: string;
  userName: string;
  displayName: string;
  profilePicture: string;
  status: string;
  friendId: string;
  createdAt: string;
}

interface RootState {
  userInfo: {
    userInfo: UserInfo;
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Online":
      return "bg-green-500";
    case "Do Not Disturb":
      return "bg-red-500";
    case "Idle":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

export const UserProfile: React.FC = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.userInfo);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);

  const formattedJoinedDate = userInfo.joined_date
    ? new Date(userInfo.joined_date).toLocaleDateString()
    : "";

  useEffect(() => {
    fetchCommunities();
    fetchFriends();
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
      toast.error("Failed to fetch communities");
    } finally {
      setLoading(false);
    }
  };

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const response = await getFriends(userInfo.userId);
      if (
        response &&
        response.data &&
        response.data.data &&
        response.data.data.friends
      ) {
        setFriends(response.data.data.friends);
      } else {
        toast.error("No friends found");
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      toast.error("Failed to fetch friends");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    if (!selectedFile) {
      setLoading(false);
      return toast.error("Please choose an image");
    }
    const formData = new FormData();
    formData.append("profilePicture", selectedFile);
    formData.append("userId", userInfo.userId);

    try {
      const response = await changeProfile(formData);
      if (response.status === 200) {
        dispatch(
          setUserInfo({
            ...userInfo,
            profile: response.data.profileUrl,
          })
        );
        setIsModalOpen(false);
        toast.success("Profile picture updated successfully");
      } else {
        toast.error(response.data);
      }
    } catch (error: any) {
      toast.error("Error updating profile picture:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value;
    try {
      const response = await changeStatus({
        status: newStatus,
        userId: userInfo.userId,
      });

      if (response?.status === 200) {
        dispatch(
          setUserInfo({
            ...userInfo,
            status: newStatus,
          })
        );
        toast.success(response.data);
      } else {
        toast.error(response?.data);
      }
    } catch (error: any) {
      toast.error("Error updating status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {loading && <Loader />}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link to="/profile/settings">
            <button className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition">
              <Cog6ToothIcon className="h-6 w-6 text-[#FF5F09]" />
            </button>
          </Link>
          <p className="text-sm md:text-base bg-gray-800 px-4 py-2 rounded-full">
            <span className="font-semibold">Joined:</span> {formattedJoinedDate}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="relative w-32 h-32 mx-auto mb-4">
            {userInfo.profile ? (
              <img
                src={userInfo.profile}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-[#FF5F09]"
              />
            ) : (
              <UserCircleIcon className="w-full h-full rounded-full text-[#FF5F09]" />
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="absolute bottom-0 right-0 bg-[#FF5F09] rounded-full p-2 hover:bg-orange-700 transition"
            >
              <PencilIcon className="h-4 w-4 text-white" />
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
              {userInfo.displayName}
              <div
                className={`ml-2 w-3 h-3 ${getStatusColor(
                  userInfo.status
                )} rounded-full`}
              ></div>
            </h1>
            <p className="text-[#FF5F09] text-xl mb-2">@{userInfo.userName}</p>
            <p className="text-gray-400 mb-4">{userInfo.email}</p>
            <div className="flex justify-center gap-4">
              <div className="bg-gray-700 p-3 rounded-lg flex items-center space-x-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status:
                </label>
                <select
                  id="status"
                  value={userInfo.status}
                  className="bg-gray-600 text-white p-1 rounded"
                  onChange={handleStatusChange}
                >
                  <option value="Online">Online</option>
                  <option value="Idle">Idle</option>
                  <option value="Do Not Disturb">Do Not Disturb</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#FF5F09]">
              Communities
            </h2>
            <ul className="space-y-4">
              {communities.slice(0, 5).map((community) => (
                <li key={community._id} className="flex items-center space-x-3">
                  <img
                    src={community.profilePicture}
                    alt={community.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span>{community.name}</span>
                </li>
              ))}
            </ul>
            <Link to="/communities" className="block mt-4">
              <button className="w-full bg-[#FF5F09] text-white py-2 rounded hover:bg-orange-700 transition">
                View all
              </button>
            </Link>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#FF5F09]">
              Friends
            </h2>
            <ul className="space-y-4">
              {friends.slice(0, 5).map((friend) => (
                <li key={friend._id} className="flex items-center space-x-3">
                  <img
                    src={friend.profilePicture}
                    alt={friend.displayName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span>{friend.displayName}</span>
                </li>
              ))}
            </ul>
            <Link to="/friends" className="block mt-4">
              <button className="w-full bg-[#FF5F09] text-white py-2 rounded hover:bg-orange-700 transition">
                View all
              </button>
            </Link>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#FF5F09]">
              Your Zepchats
            </h2>
            <ul className="space-y-4">
              {["Chat 1", "Chat 2", "Chat 3", "Chat 4", "Chat 5"].map(
                (chat, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-sm">{index + 1}</span>
                    </div>
                    <span>{chat}</span>
                  </li>
                )
              )}
            </ul>
            <Link to="/zepchats" className="block mt-4">
              <button className="w-full bg-[#FF5F09] text-white py-2 rounded hover:bg-orange-700 transition">
                View all
              </button>
            </Link>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Update Profile Picture</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#FF5F09] text-white py-2 px-4 rounded hover:bg-orange-700 transition"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
