import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  PencilIcon,
  UserMinusIcon,
  FlagIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import {
  getMembers,
  removeMember,
  updateCommunity,
  makeAdmin,
} from "../../../api/community";
import { toast } from "react-hot-toast";
import { reportUser } from "../../../api/friends";

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

interface CommunityData {
  _id: string;
  communityId: string;
  members: User[];
  admin: User;
}

interface CommunityProfileProps {
  community: Community;
  onClose: () => void;
  onUpdate: (updatedCommunity: Community) => void;
}

const CommunityProfile: React.FC<CommunityProfileProps> = ({
  community,
  onClose,
  onUpdate,
}) => {
  const { userInfo } = useSelector((state: any) => state.userInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCommunity, setEditedCommunity] = useState(community);
  const [communityData, setCommunityData] = useState<CommunityData | null>(
    null
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportedUser, setReportedUser] = useState<User | null>(null);
  const [reportSubject, setReportSubject] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [makeAdminModalOpen, setMakeAdminModalOpen] = useState(false);
  const [newAdminUser, setNewAdminUser] = useState<User | null>(null);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    fetchCommunityData();
  }, [community]);

  const fetchCommunityData = async () => {
    try {
      const response = await getMembers(community._id);

      if (response.data) {
        setCommunityData(response.data);
        setMemberCount(response.data.memberCount);
        setIsAdmin(response.data.admin._id === userInfo.userId);
      } else {
        console.error("No community data received from API");
      }
    } catch (error) {
      console.error("Error fetching community data:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await updateCommunity({
        communityId: community._id,
        name: editedCommunity.name,
        description: editedCommunity.description,
        tags: editedCommunity.hashtags,
      });

      if (response.status === 200) {
        toast.success("Community updated successfully");
        onUpdate(editedCommunity);
        setIsEditing(false);
      } else {
        toast.error("Failed to update community");
      }
    } catch (error) {
      console.error("Error updating community:", error);
      toast.error("An error occurred while updating the community");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedCommunity((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editedCommunity.hashtags.includes(newTag.trim())) {
      setEditedCommunity((prev) => ({
        ...prev,
        hashtags: [...prev.hashtags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEditedCommunity((prev) => ({
      ...prev,
      hashtags: prev.hashtags.filter((t) => t !== tag),
    }));
  };

  const handleRemoveMember = async (userId: string) => {
    if (!isAdmin) return;
    try {
      const response = await removeMember({
        userId,
        communityId: community._id,
      });

      if (response.status === 200) {
        const removedUser = communityData?.members.find(
          (member) => member._id === userId
        );
        if (removedUser) {
          toast.success(
            `${removedUser.displayName} removed successfully from the community`
          );
        } else {
          toast.success("User removed successfully from the community");
        }
        fetchCommunityData();
      } else {
        toast.error("Failed to remove member from the community");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("An error occurred while removing the member");
    }
  };

  const handleMakeAdmin = (userId: string) => {
    if (!isAdmin) return;
    const newAdmin = communityData?.members.find(
      (member) => member._id === userId
    );
    if (newAdmin) {
      setNewAdminUser(newAdmin);
      setMakeAdminModalOpen(true);
    }
  };

  const confirmMakeAdmin = async () => {
    if (!newAdminUser) return;
    try {
      const response = await makeAdmin({
        userId: newAdminUser._id,
        communityId: community._id,
      });

      if (response.status === 200) {
        toast.success(`${newAdminUser.displayName} has been promoted to admin`);
        fetchCommunityData();
        setMakeAdminModalOpen(false);
        setNewAdminUser(null);
      } else {
        toast.error("Failed to promote member to admin");
      }
    } catch (error) {
      console.error("Error making admin:", error);
      toast.error("An error occurred while promoting the member to admin");
    }
  };

  const isUserAdmin = (userId: string) => {
    return communityData?.admin?._id === userId;
  };

  const handleReportUser = (user: User) => {
    setReportedUser(user);
    setReportModalOpen(true);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportedUser) return;

    try {
      const response = await reportUser({
        reporterId: userInfo.userId,
        reportedUserId: reportedUser._id,
        subject: reportSubject,
        reason: reportReason,
      });

      if (response.status === 200) {
        setReportModalOpen(false);
        toast.success("Report submitted successfully");
        setReportSubject("");
        setReportReason("");
      } else {
        toast.error("Failed to submit report");
      }
    } catch (error) {
      console.error("Error reporting user:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-black text-xl font-bold">Community Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={community.profilePicture || "/default-avatar.png"}
            alt={community.name}
            className="w-24 h-24 object-cover mb-4 border-4 border-orange-500"
          />
          {!isEditing && (
            <>
              <h2 className="text-2xl font-bold text-black mb-2">
                {community.name}
              </h2>
              <p className="text-gray-600 text-center mb-4">
                {community.description}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {community.hashtags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 text-gray-300 px-3 py-1 text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="text-gray-500 text-sm">
                Created on: {new Date(community.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-500 text-sm mb-4">
                {community.isPrivate ? "Private Community" : "Public Community"}
              </p>
              {isAdmin && (
                <button
                  onClick={handleEdit}
                  className="mb-4 bg-orange-500 text-white px-4 py-2 hover:bg-orange-600 transition-colors flex items-center"
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit Community
                </button>
              )}
            </>
          )}
        </div>

        <h3 className="text-xl font-semibold text-black mt-6 mb-4">Members</h3>
        <div className="max-h-64 overflow-y-auto bg-gray-100 p-4">
          {communityData?.admin && (
            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div className="flex items-center">
                <img
                  src={
                    communityData.admin.profilePicture || "default-avatar.png"
                  }
                  alt={communityData.admin.userName}
                  className="w-10 h-10 object-cover mr-3"
                />
                <div>
                  <span className="text-gray-200 font-semibold">
                    {communityData.admin.displayName}
                  </span>
                  <div className="text-sm text-orange-500">Admin</div>
                </div>
              </div>
              {communityData.admin._id !== userInfo.userId && (
                <button
                  onClick={() => handleReportUser(communityData.admin)}
                  className="text-yellow-500 hover:text-yellow-600"
                  title="Report user"
                >
                  <FlagIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
          {communityData?.members.map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between py-3 border-b border-gray-700"
            >
              <div className="flex items-center">
                <img
                  src={member.profilePicture || "default-avatar.png"}
                  alt={member.userName}
                  className="w-10 h-10 object-cover mr-3"
                />
                <div>
                  <span className="text-gray-200 font-semibold">
                    {member.displayName}
                  </span>
                  <div className="text-sm text-gray-400">
                    @{member.userName}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                {isAdmin &&
                  member._id !== userInfo.userId &&
                  !isUserAdmin(member._id) && (
                    <>
                      <button
                        onClick={() => handleMakeAdmin(member._id)}
                        className="text-green-500 hover:text-green-600 mr-2"
                        title="Make admin"
                      >
                        <UserPlusIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRemoveMember(member._id)}
                        className="text-red-500 hover:text-red-600 mr-2"
                        title="Remove member"
                      >
                        <UserMinusIcon className="w-5 h-5" />
                      </button>
                    </>
                  )}
                {member._id !== userInfo.userId && (
                  <button
                    onClick={() => handleReportUser(member)}
                    className="text-yellow-500 hover:text-yellow-600"
                    title="Report user"
                  >
                    <FlagIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Community Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-96">
            <h3 className="text-xl font-semibold text-black mb-4">
              Edit Community
            </h3>
            <input
              type="text"
              name="name"
              value={editedCommunity.name}
              onChange={handleChange}
              className="w-full bg-gray-100 text-black px-3 py-2 mb-3"
              placeholder="Community Name"
            />
            <textarea
              name="description"
              value={editedCommunity.description}
              onChange={handleChange}
              className="w-full bg-gray-100 text-black px-3 py-2 mb-3 h-24"
              placeholder="Community Description"
            />
            <div className="flex mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-grow bg-gray-100 text-black px-2 py-1"
                placeholder="Add a hashtag"
              />
              <button
                onClick={handleAddTag}
                className="bg-orange-500 text-white px-4 py-1 hover:bg-orange-600 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {editedCommunity.hashtags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-gray-700 px-3 py-1 flex items-center"
                >
                  <span className="text-gray-300 text-sm">#{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-red-500 font-bold"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-black px-4 py-2 mr-2 hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-orange-500 text-white px-4 py-2 hover:bg-orange-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Make Admin Modal */}
      {makeAdminModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-96">
            <h3 className="text-xl font-semibold text-black mb-4">
              Make {newAdminUser?.displayName} Admin
            </h3>
            <p className="text-gray-600 mb-4">
              If you make {newAdminUser?.displayName} the admin, you will no
              longer be the admin of this community. Are you sure you want to
              proceed?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setMakeAdminModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 mr-2 hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmMakeAdmin}
                className="bg-green-500 text-white px-4 py-2 hover:bg-green-600 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report User Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-96">
            <h3 className="text-xl font-semibold text-black mb-4">
              Report User: {reportedUser?.displayName}
            </h3>
            <form onSubmit={handleReportSubmit}>
              <input
                type="text"
                value={reportSubject}
                onChange={(e) => setReportSubject(e.target.value)}
                placeholder="Subject"
                className="w-full bg-gray-100 text-black px-3 py-2 mb-3"
                required
              />
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Reason for reporting"
                className="w-full bg-gray-100 text-black px-3 py-2 mb-3 h-32"
                required
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 mr-2 hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-500 text-white px-4 py-2 hover:bg-red-600 transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityProfile;
