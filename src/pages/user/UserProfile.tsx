import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Cog6ToothIcon,
  PencilIcon,
  UserCircleIcon,
  ArrowLeftIcon,
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
  const navigate = useNavigate();
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {loading && <Loader />}
      <motion.div
        className="container mx-auto px-4 py-8"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <motion.button
              onClick={() => navigate("/home")}
              className="p-2 rounded-full hover:bg-gray-700 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeftIcon className="h-8 w-8 text-[#FF5F09]" />
            </motion.button>
            <Link to="/profile/settings">
              <motion.button
                className="p-2 rounded-full hover:bg-gray-700 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Cog6ToothIcon className="h-8 w-8 text-[#FF5F09]" />
              </motion.button>
            </Link>
          </div>
          <motion.p
            className="text-sm md:text-base px-4 py-2 rounded-full bg-[#FF5F09] shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <span className="font-semibold">Joined:</span> {formattedJoinedDate}
          </motion.p>
        </div>

        <motion.div className="text-center mb-8" variants={fadeInUp}>
          <motion.div
            className="relative w-32 h-32 mx-auto mb-4"
            whileHover={{ scale: 1.1 }}
          >
            {userInfo.profile ? (
              <img
                src={userInfo.profile}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-[#FF5F09] shadow-2xl"
              />
            ) : (
              <UserCircleIcon className="w-full h-full rounded-full text-[#FF5F09]" />
            )}
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="absolute bottom-0 right-0 bg-[#FF5F09] rounded-full p-2 hover:bg-[#FF7F3F] transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <PencilIcon className="h-4 w-4 text-white" />
            </motion.button>
          </motion.div>
          <motion.h1
            className="text-3xl font-bold mb-2 flex items-center justify-center"
            variants={fadeInUp}
          >
            {userInfo.displayName}
            <motion.div
              className={`ml-2 w-3 h-3 ${getStatusColor(
                userInfo.status
              )} rounded-full`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            ></motion.div>
          </motion.h1>
          <motion.p className="text-[#FF5F09] text-xl mb-2" variants={fadeInUp}>
            @{userInfo.userName}
          </motion.p>
          <motion.p className="text-gray-400 mb-4" variants={fadeInUp}>
            {userInfo.email}
          </motion.p>
          <motion.div className="flex justify-center gap-4" variants={fadeInUp}>
            <motion.div
              className="p-3 rounded-lg flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <label htmlFor="status" className="text-sm font-medium">
                Status:
              </label>
              <select
                id="status"
                value={userInfo.status}
                className=" text-black p-1 rounded"
                onChange={handleStatusChange}
              >
                <option value="Online">Online</option>
                <option value="Idle">Idle</option>
                <option value="Do Not Disturb">Do Not Disturb</option>
              </select>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={fadeInUp}
        >
          {["Communities", "Friends", "Your Zepchats"].map((section, index) => (
            <motion.div
              key={section}
              className="p-6"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4 text-[#FF5F09]">
                {section}
              </h2>
              <ul className="space-y-4">
                {(section === "Communities"
                  ? communities
                  : section === "Friends"
                  ? friends
                  : Array(5)
                      .fill(null)
                      .map((_, i) => ({ _id: i, name: `Chat ${i + 1}` }))
                )
                  .slice(0, 5)
                  .map((item: any, itemIndex) => (
                    <motion.li
                      key={item._id}
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: itemIndex * 0.1 }}
                    >
                      {section !== "Your Zepchats" ? (
                        <img
                          src={
                            item.profilePicture ||
                            "https://via.placeholder.com/40"
                          }
                          alt={item.name || item.displayName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FF5F09]">
                          <span className="text-sm">{itemIndex + 1}</span>
                        </div>
                      )}
                      <span>{item.name || item.displayName}</span>
                    </motion.li>
                  ))}
              </ul>
              <Link
                to={`/${section.toLowerCase().replace(/\s+/g, "")}`}
                className="block mt-4"
              >
                <motion.button
                  className="w-full bg-[#FF5F09] text-white py-2 rounded hover:bg-[#FF7F3F] transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View all
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="p-6 rounded-lg bg-gray-800 shadow-2xl"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
          >
            <h2 className="text-xl font-bold mb-4 text-[#FF5F09]">
              Update Profile Picture
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="mb-4 text-gray-300"
              />
              <div className="flex justify-end space-x-2">
                <motion.button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-white py-2 px-4 rounded bg-gray-600 hover:bg-gray-700 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  className="bg-[#FF5F09] text-white py-2 px-4 rounded hover:bg-[#FF7F3F] transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Upload
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default UserProfile;
