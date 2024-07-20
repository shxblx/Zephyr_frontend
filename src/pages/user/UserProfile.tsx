import {
  Cog6ToothIcon,
  EyeIcon,
  PencilIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { setUserInfo } from "../../redux/slices/userSlice/userSlice";
import { useState } from "react";
import { changeProfile, changeStatus } from "../../api/user";
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

  const formattedJoinedDate = userInfo.joined_date
    ? new Date(userInfo.joined_date).toLocaleDateString()
    : "";

  const user = {
    displayName: userInfo.displayName,
    username: userInfo.userName,
    email: userInfo.email,
    communities: ["Gaming", "Tech", "Music", "Art", "Movies"],
    friends: ["Alice", "Bob", "Charlie", "David", "Eve"],
    zepchats: ["Chat 1", "Chat 2", "Chat 3", "Chat 4", "Chat 5"],
    wallet: 0,
    joinDate: "January 2023",
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
        console.log(response);

        dispatch(
          setUserInfo({
            ...userInfo,
            profile: response.data.profileUrl,
          })
        );
        setIsModalOpen(false);
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
        setIsModalOpen(false);
      } else {
        toast.error(response?.data);
      }
    } catch (error: any) {
      toast.error("Error updating status:", error);
    }
  };

  return (
    <div>
      {loading && <Loader />}
      <div className="min-h-screen p-4 md:p-8 text-white">
        <div className="mx-auto">
          <div className="flex justify-between items-center mb-4">
            <Link to="/profile/settings">
              <button className="bg-transparent text-[#FF5F09] hover:text-orange-700 transition">
                <Cog6ToothIcon className="h-6 w-6" />
              </button>
            </Link>
            <p className="text-sm md:text-base">
              <span className="font-semibold">Joined:</span>{" "}
              {formattedJoinedDate}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-3">
              <div className="text-center mb-8 relative">
                {userInfo.profile ? (
                  <img
                    src={userInfo.profile}
                    alt="Profile"
                    className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white"
                  />
                ) : (
                  <UserCircleIcon className="w-32 h-32 rounded-full mx-auto mb-4 border-4 text-[#FF5F09]" />
                )}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="absolute top-20 right-1/2 transform translate-x-16 translate-y-4 bg-ff5f09 rounded-full p-2 hover:bg-orange-700 transition"
                >
                  <PencilIcon className="h-4 w-4 text-white" />
                </button>
                <h1 className="text-2xl font-bold relative inline-flex items-center">
                  {user.displayName}
                  <div
                    className={`ml-2 w-3 h-3 ${getStatusColor(
                      userInfo.status
                    )} rounded-full border-2 border-black`}
                  ></div>
                </h1>
                <p className="text-[#FF5F09]">@{user.username}</p>
                <p className="text-white mt-2">{user.email}</p>
              </div>

              <div className="flex justify-center gap-4">
                <div className="bg-gray-800 p-3 rounded-lg flex items-center space-x-2 relative">
                  <label htmlFor="status" className="block text-sm font-medium">
                    Status:
                  </label>

                  <select
                    id="status"
                    value={userInfo.status}
                    className="bg-gray-700 text-white p-1 rounded"
                    onChange={handleStatusChange}
                  >
                    <option value="Online">Online</option>
                    <option value="Idle">Idle</option>
                    <option value="Do Not Disturb">Do Not Disturb</option>
                  </select>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg flex items-center space-x-2">
                  <h2 className="text-sm font-medium">Wallet:</h2>
                  <p className="text-sm font-semibold">{user.wallet}</p>
                  <button>
                    <Link to="/profile/wallet">
                      <EyeIcon className="h-5 w-5 text-ff5f09" />
                    </Link>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Communities</h2>
              <ul className="list-disc pl-5 mb-4">
                {user.communities.slice(0, 5).map((community, index) => (
                  <li key={index}>{community}</li>
                ))}
              </ul>
              <button className="w-full bg-[#FF5F09] text-white py-2 rounded hover:bg-orange-700 transition">
                View all
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Friends</h2>
              <ul className="list-disc pl-5 mb-4">
                {user.friends.slice(0, 5).map((friend, index) => (
                  <li key={index}>{friend}</li>
                ))}
              </ul>
              <button className="w-full bg-[#FF5F09] text-white py-2 rounded hover:bg-orange-700 transition">
                View all
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Your Zepchats</h2>
              <ul className="list-disc pl-5 mb-4">
                {user.zepchats.slice(0, 5).map((chat, index) => (
                  <li key={index}>{chat}</li>
                ))}
              </ul>
              <button className="w-full bg-[#FF5F09] text-white py-2 rounded hover:bg-orange-700 transition">
                View all
              </button>
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
    </div>
  );
};
