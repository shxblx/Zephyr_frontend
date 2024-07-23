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

interface User {
  _id: string;
  userName: string;
  displayName: string;
  profilePicture?: string;
  status: string;
}

interface UserInfo {
  userId: string;
  profilePicture: string;
}

interface RootState {
  userInfo: UserInfo;
}

const CreateCommunity: React.FC = () => {
  const userInfo = useSelector((state: RootState) => state.userInfo);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || hashtags.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("hashtags", JSON.stringify(hashtags));
    formData.append("isPrivate", isPrivate.toString());

    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    selectedUsers.forEach((user, index) => {
      formData.append(`selectedUsers[${index}]`, user._id);
    });

    try {
      const response = await createCommunity(formData);
      if (response.status === 200) {
        toast.success("Community created successfully!");
      } else {
        toast.error("Failed to create community. Please try again.");
      }
    } catch (error) {
      console.error("Error creating community:", error);
      toast.error("An error occurred while creating the community.");
    }
  };

  const addUser = (user: User) => {
    if (!selectedUsers.find((u) => u._id === user._id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const removeUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));
  };

  const addHashtag = () => {
    if (hashtag.trim() && !hashtags.includes(hashtag.trim())) {
      setHashtags([...hashtags, hashtag.trim()]);
      setHashtag("");
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 w-full h-full overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-white block mb-1">Community Name*</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="text-white block mb-1">Description*</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="text-white block mb-1">Hashtags*</label>
          <div className="flex">
            <input
              type="text"
              value={hashtag}
              onChange={(e) => setHashtag(e.target.value)}
              className="flex-grow bg-gray-700 text-white rounded-l px-3 py-2"
              placeholder="Add a hashtag"
            />
            <button
              type="button"
              onClick={addHashtag}
              className="bg-[#ff5f09] text-white px-4 py-2 rounded-r hover:bg-orange-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {hashtags.map((tag, index) => (
              <div
                key={index}
                className="bg-gray-700 rounded-full px-3 py-1 flex items-center"
              >
                <span className="text-white text-sm">#{tag}</span>
                <button
                  type="button"
                  onClick={() => removeHashtag(tag)}
                  className="ml-2 text-red-500 font-bold"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="text-white block mb-1">Privacy</label>
          <select
            value={isPrivate ? "private" : "public"}
            onChange={(e) => setIsPrivate(e.target.value === "private")}
            className="w-full bg-gray-700 text-white rounded px-3 py-2"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div>
          <label className="text-white block mb-1">Profile Picture</label>
          <input
            type="file"
            onChange={(e) =>
              setProfilePicture(e.target.files ? e.target.files[0] : null)
            }
            className="w-full bg-gray-700 text-white rounded px-3 py-2"
            accept="image/*"
          />
        </div>
        <div>
          <label className="text-white block mb-1">Add Users</label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 pl-10"
              placeholder="Search users..."
            />
            <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          {loading ? (
            <div className="mt-2 text-white flex justify-center items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#FF5F09]"></div>
            </div>
          ) : (
            searchResults.length > 0 && (
              <div className="mt-2 bg-gray-700 rounded max-h-60 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-2 hover:bg-gray-600"
                  >
                    <div className="flex items-center">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.displayName}
                          className="w-10 h-10 rounded-full object-cover mr-2"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-2">
                          <UserIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-white text-sm font-semibold">
                          {user.displayName}
                        </h3>
                        <p className="text-gray-400 text-xs">
                          @{user.userName}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => addUser(user)}
                      className={`p-1 rounded-full transition-colors ${
                        selectedUsers.some((u) => u._id === user._id)
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-[#FF5F09] hover:bg-orange-600"
                      }`}
                    >
                      {selectedUsers.some((u) => u._id === user._id) ? (
                        <CheckIcon className="w-5 h-5 text-white" />
                      ) : (
                        <PlusIcon className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
        {selectedUsers.length > 0 && (
          <div>
            <label className="text-white block mb-1">Selected Users</label>
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-gray-700 rounded-full px-3 py-1 flex items-center"
                >
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.displayName}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center mr-2">
                      <UserIcon className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  <span className="text-white text-sm">{user.displayName}</span>
                  <button
                    type="button"
                    onClick={() => removeUser(user._id)}
                    className="ml-2 text-red-500 font-bold"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#ff5f09] text-white px-4 py-2 rounded hover:bg-orange-700"
          >
            Create Community
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCommunity;
