import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  PencilIcon,
  UserMinusIcon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import axios from "axios";
import { getMembers } from "../../../api/community";

interface User {
  _id: string;
  userName: string;
  displayName: string;
  profilePicture: string;
  status: string;
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

interface CommunityProfileProps {
  community: Community;
  onClose: () => void;
  onUpdate: (updatedCommunity: Community) => void;
}

const statusColor = (status: string) => {
  switch (status) {
    case "Online":
      return "text-green-500";
    case "Idle":
      return "text-orange-500";
    case "Do Not Disturb":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

const CommunityProfile: React.FC<CommunityProfileProps> = ({
  community,
  onClose,
  onUpdate,
}) => {
  const { userInfo } = useSelector((state: any) => state.userInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCommunity, setEditedCommunity] = useState(community);
  const [members, setMembers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchMembers();
    setIsAdmin(userInfo.userId === community.createdBy);
  }, [community, userInfo]);

  const fetchMembers = async () => {
    try {
      const response = await getMembers(community._id);
      if (response.data) {
        setMembers(response.data);
      } else {
        console.error("No data received from API");
      }
    } catch (error) {
      console.error("Error fetching community members:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(editedCommunity);
    setIsEditing(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedCommunity((prev) => ({ ...prev, [name]: value }));
  };

  const handleHashtagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hashtags = e.target.value.split(",").map((tag) => tag.trim());
    setEditedCommunity((prev) => ({ ...prev, hashtags }));
  };

  const handleRemoveMember = async (userId: string) => {
    if (!isAdmin) return;

    try {
      await axios.delete(`/api/communities/${community._id}/members/${userId}`);
      setMembers(members.filter((member) => member._id !== userId));
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>
      <div className="flex flex-col items-center">
        <img
          src={community.profilePicture || "default-avatar.png"}
          alt={community.name}
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={editedCommunity.name}
            onChange={handleChange}
            className="text-2xl font-bold text-white mb-2 bg-gray-800 rounded px-2 py-1"
          />
        ) : (
          <h2 className="text-2xl font-bold text-white mb-2">
            {community.name}
          </h2>
        )}
        {isEditing ? (
          <textarea
            name="description"
            value={editedCommunity.description}
            onChange={handleChange}
            className="text-gray-400 text-center mb-4 bg-gray-800 rounded px-2 py-1 w-full"
          />
        ) : (
          <p className="text-gray-400 text-center mb-4">
            {community.description}
          </p>
        )}
        {isEditing ? (
          <input
            type="text"
            value={editedCommunity.hashtags.join(", ")}
            onChange={handleHashtagChange}
            className="bg-gray-800 text-gray-300 px-2 py-1 rounded mb-4 w-full"
            placeholder="Enter hashtags separated by commas"
          />
        ) : (
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {community.hashtags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        <p className="text-gray-500 text-sm">
          Created on: {new Date(community.createdAt).toLocaleDateString()}
        </p>
        <p className="text-gray-500 text-sm">
          {community.isPrivate ? "Private Community" : "Public Community"}
        </p>
        {isAdmin && !isEditing && (
          <button
            onClick={handleEdit}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center"
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            Edit Community
          </button>
        )}
        {isEditing && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        <h3 className="text-xl font-semibold text-white mt-6 mb-4">Members</h3>
        <div className="w-full max-h-60 overflow-y-auto">
          {members.map((member) =>
            member ? (
              <div
                key={member._id}
                className="flex items-center justify-between py-2 border-b border-gray-700"
              >
                <div className="flex items-center">
                  <img
                    src={member.profilePicture || "default-avatar.png"}
                    alt={member.userName}
                    className="w-8 h-8 rounded-full object-cover mr-3"
                  />
                  <div>
                    <span className="text-gray-300">{member.displayName}</span>
                    <div className={`text-sm ${statusColor(member.status)}`}>
                      {member.status}
                    </div>
                  </div>
                </div>
                {isAdmin && member._id !== userInfo.userId && (
                  <button
                    onClick={() => handleRemoveMember(member._id)}
                    className="text-red-500 hover:text-red-600"
                    title="Remove member"
                  >
                    <UserMinusIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityProfile;
