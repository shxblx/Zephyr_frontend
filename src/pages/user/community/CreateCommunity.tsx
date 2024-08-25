import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { fetchAllUsers } from "../../../api/friends";
import {
  UserIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { createCommunity } from "../../../api/community";
import Loader from "../../../components/common/user/Loader";

interface User {
  _id: string;
  userName: string;
  displayName: string;
  profilePicture?: string;
  status: string;
}

interface CreateCommunityProps {
  onClose: () => void;
  onCommunityCreated: () => void;
}

const CreateCommunity: React.FC<CreateCommunityProps> = ({
  onClose,
  onCommunityCreated,
}) => {
  const { userInfo } = useSelector((state: any) => state.userInfo);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [hashtagsError, setHashtagsError] = useState("");
  const [profilePictureError, setProfilePictureError] = useState("");
  const [membersError, setMembersError] = useState("");

  const fetchUsers = async (search: string = "") => {
    setLoading(true);
    try {
      const response = await fetchAllUsers(search);
      if (response.data && response.data.data && response.data.data.users) {
        const filteredUsers = response.data.data.users.filter(
          (user: User) => user._id !== userInfo.userId
        );
        setSearchResults(filteredUsers);
      } else {
        setSearchResults([]);
        if (search) {
          toast.error("No users found");
        } else {
          toast.error("Failed to fetch users data");
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users. Please try again later.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      fetchUsers(query);
    } else {
      setSearchResults([]);
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    if (!name.trim()) {
      setNameError("Community name is required");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!description.trim()) {
      setDescriptionError("Description is required");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    if (hashtags.length === 0) {
      setHashtagsError("At least one hashtag is required");
      isValid = false;
    } else {
      setHashtagsError("");
    }

    if (!profilePicture) {
      setProfilePictureError("Profile picture is required");
      isValid = false;
    } else {
      setProfilePictureError("");
    }

    if (selectedUsers.length === 0) {
      setMembersError("At least one member must be added");
      isValid = false;
    } else {
      setMembersError("");
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("hashtags", JSON.stringify(hashtags));
    formData.append("isPrivate", isPrivate.toString());
    formData.append("adminId", userInfo.userId);

    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    const selectedUserIds = selectedUsers.map((user) => user._id);
    formData.append("selectedUsers", JSON.stringify(selectedUserIds));

    try {
      setLoading(true)
      const response = await createCommunity(formData);
      if (response.status === 200) {
        toast.success(response.data);
        onCommunityCreated();
        onClose();
      } else {
        toast.error("Failed to create community. Please try again.");
      }
    } catch (error) {
      console.error("Error creating community:", error);
      toast.error("An error occurred while creating the community.");
    }finally{
      setLoading(false)
    }
  };

  const addUser = (user: User) => {
    if (!selectedUsers.find((u) => u._id === user._id)) {
      setSelectedUsers([...selectedUsers, user]);
      setMembersError("");
    }
  };

  const removeUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));
  };

  const addHashtag = () => {
    if (hashtag.trim() && !hashtags.includes(hashtag.trim())) {
      setHashtags([...hashtags, hashtag.trim()]);
      setHashtag("");
      setHashtagsError("");
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  return (
    <div>
      {loading && <Loader />}
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-4 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-black text-xl font-bold">Create Community</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-black text-sm block mb-1">
                Community Name*
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError("");
                }}
                className="w-full bg-gray-100 text-black text-sm px-2 py-1"
              />
              {nameError && (
                <p className="text-red-500 text-xs mt-1">{nameError}</p>
              )}
            </div>
            <div>
              <label className="text-black text-sm block mb-1">
                Description*
              </label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setDescriptionError("");
                }}
                className="w-full bg-gray-100 text-black text-sm px-2 py-1 h-16 resize-none"
              />
              {descriptionError && (
                <p className="text-red-500 text-xs mt-1">{descriptionError}</p>
              )}
            </div>
            <div>
              <label className="text-black text-sm block mb-1">Hashtags*</label>
              <div className="flex">
                <input
                  type="text"
                  value={hashtag}
                  onChange={(e) => setHashtag(e.target.value)}
                  className="flex-grow bg-gray-100 text-black text-sm px-2 py-1"
                  placeholder="Add a hashtag"
                />
                <button
                  type="button"
                  onClick={addHashtag}
                  className="bg-[#ff5f09] text-white text-sm px-2 py-1 ml-1 hover:bg-orange-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {hashtags.map((tag, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 px-2 py-0.5 flex items-center"
                  >
                    <span className="text-black text-xs">#{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeHashtag(tag)}
                      className="ml-1 text-red-500 font-bold"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              {hashtagsError && (
                <p className="text-red-500 text-xs mt-1">{hashtagsError}</p>
              )}
            </div>
            <div>
              <label className="text-black text-sm block mb-1">Privacy</label>
              <select
                value={isPrivate ? "private" : "public"}
                onChange={(e) => setIsPrivate(e.target.value === "private")}
                className="w-full bg-gray-100 text-black text-sm px-2 py-1"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div>
              <label className="text-black text-sm block mb-1">
                Profile Picture*
              </label>
              <input
                type="file"
                onChange={(e) => {
                  setProfilePicture(e.target.files ? e.target.files[0] : null);
                  setProfilePictureError("");
                }}
                className="w-full bg-gray-100 text-black text-sm px-2 py-1"
                accept="image/*"
              />
              {profilePictureError && (
                <p className="text-red-500 text-xs mt-1">
                  {profilePictureError}
                </p>
              )}
            </div>
            <div>
              <label className="text-black text-sm block mb-1">
                Add Users*
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full bg-gray-100 text-black text-sm px-2 py-1 pl-8"
                  placeholder="Search users..."
                />
                <UserIcon className="absolute left-2 top-1.5 h-4 w-4 text-gray-400" />
              </div>
              {loading ? (
                <div className="mt-1 text-black flex justify-center items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#FF5F09]"></div>
                </div>
              ) : (
                searchResults.length > 0 && (
                  <div className="mt-1 bg-gray-100 max-h-32 overflow-y-auto">
                    {searchResults.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between p-1 hover:bg-gray-200"
                      >
                        <div className="flex items-center">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user.displayName}
                              className="w-6 h-6 rounded-full object-cover mr-1"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-1">
                              <UserIcon className="w-4 h-4 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <h3 className="text-black text-xs font-semibold">
                              {user.displayName}
                            </h3>
                            <p className="text-gray-600 text-xs">
                              @{user.userName}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => addUser(user)}
                          className={`p-0.5 transition-colors ${
                            selectedUsers.some((u) => u._id === user._id)
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-[#FF5F09] hover:bg-orange-600"
                          }`}
                        >
                          {selectedUsers.some((u) => u._id === user._id) ? (
                            <CheckIcon className="w-3 h-3 text-white" />
                          ) : (
                            <PlusIcon className="w-3 h-3 text-white" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )
              )}
              {membersError && (
                <p className="text-red-500 text-xs mt-1">{membersError}</p>
              )}
            </div>
            {selectedUsers.length > 0 && (
              <div>
                <label className="text-black text-sm block mb-1">
                  Selected Users
                </label>
                <div className="flex flex-wrap gap-1">
                  {selectedUsers.map((user) => (
                    <div
                      key={user._id}
                      className="bg-gray-200 px-2 py-0.5 flex items-center"
                    >
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.displayName}
                          className="w-4 h-4 rounded-full mr-1"
                        />
                      ) : (
                        <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center mr-1">
                          <UserIcon className="w-3 h-3 text-gray-500" />
                        </div>
                      )}
                      <span className="text-black text-xs">
                        {user.displayName}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeUser(user._id)}
                        className="ml-1 text-red-500 font-bold"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#ff5f09] text-white text-sm px-4 py-1 hover:bg-orange-700 focus:outline-none transition-colors"
              >
                Create Community
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunity;
