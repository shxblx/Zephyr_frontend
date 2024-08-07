import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import {
  getZepchatById,
  voteZepchat,
  deleteZepchat,
  updateZepchat,
  reportZepchat,
} from "../../../api/zepchat";
import ZepChatReplies from "./ZepChatReplies";

interface ZepChat {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    displayName: string;
    profilePicture: string;
  };
  timestamp: string;
  tags: string[];
  upVotes: number;
  downVotes: number;
  upVoters: Voter[];
  downVoters: Voter[];
}

interface Voter {
  userId: string;
  _id: string;
}

const ZepChatView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: any) => state.userInfo);
  const [zepChat, setZepChat] = useState<ZepChat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");
  const [reportSubject, setReportSubject] = useState("");
  const [reportReason, setReportReason] = useState("");

  const fetchZepChat = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (id) {
        const zepchatResponse = await getZepchatById(id);
        if (zepchatResponse.status === 200 && zepchatResponse.data) {
          setZepChat(
            Array.isArray(zepchatResponse.data)
              ? zepchatResponse.data[0]
              : zepchatResponse.data
          );
        } else {
          throw new Error("Failed to fetch ZepChat");
        }
      }
    } catch (error) {
      console.error("Error fetching ZepChat:", error);
      setError("An error occurred while fetching data. Please try again.");
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchZepChat();
  }, [fetchZepChat]);

  const handleVoteZepChat = async (voteType: "upVote" | "downVote") => {
    if (!zepChat) return;

    const userId = userInfo.userId;
    const hasUpvoted = zepChat.upVoters.some(
      (voter) => voter.userId === userId
    );
    const hasDownvoted = zepChat.downVoters.some(
      (voter) => voter.userId === userId
    );

    let actualVoteType:
      | "upVote"
      | "downVote"
      | "removeUpVote"
      | "removeDownVote";

    if (voteType === "upVote" && hasUpvoted) {
      actualVoteType = "removeUpVote";
    } else if (voteType === "downVote" && hasDownvoted) {
      actualVoteType = "removeDownVote";
    } else if (voteType === "upVote" && hasDownvoted) {
      actualVoteType = "upVote";
    } else if (voteType === "downVote" && hasUpvoted) {
      actualVoteType = "downVote";
    } else {
      actualVoteType = voteType;
    }

    try {
      const response = await voteZepchat({
        zepchatId: zepChat._id,
        voteType: actualVoteType,
        userId: userId,
      });

      if (response.status === 200) {
        setZepChat((prevZepChat) => {
          if (!prevZepChat) return null;
          const updatedZepChat = { ...prevZepChat };

          if (actualVoteType === "upVote") {
            updatedZepChat.upVotes++;
            updatedZepChat.upVoters.push({
              userId,
              _id: Date.now().toString(),
            });
            if (hasDownvoted) {
              updatedZepChat.downVotes--;
              updatedZepChat.downVoters = updatedZepChat.downVoters.filter(
                (voter) => voter.userId !== userId
              );
            }
          } else if (actualVoteType === "downVote") {
            updatedZepChat.downVotes++;
            updatedZepChat.downVoters.push({
              userId,
              _id: Date.now().toString(),
            });
            if (hasUpvoted) {
              updatedZepChat.upVotes--;
              updatedZepChat.upVoters = updatedZepChat.upVoters.filter(
                (voter) => voter.userId !== userId
              );
            }
          } else if (actualVoteType === "removeUpVote") {
            updatedZepChat.upVotes--;
            updatedZepChat.upVoters = updatedZepChat.upVoters.filter(
              (voter) => voter.userId !== userId
            );
          } else if (actualVoteType === "removeDownVote") {
            updatedZepChat.downVotes--;
            updatedZepChat.downVoters = updatedZepChat.downVoters.filter(
              (voter) => voter.userId !== userId
            );
          }

          return updatedZepChat;
        });
        toast.success("Vote recorded successfully");
      } else {
        toast.error("Failed to vote");
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleBack = () => {
    navigate("/zepchats");
  };

  const hasUserVoted = (item: ZepChat, voteType: "upVote" | "downVote") => {
    const voters = voteType === "upVote" ? item.upVoters : item.downVoters;
    return voters?.some((voter) => voter.userId === userInfo.userId) || false;
  };

  const handleEdit = () => {
    if (zepChat) {
      setEditTitle(zepChat.title);
      setEditContent(zepChat.content);
      setEditTags(zepChat.tags.join(", "));
      setShowEditModal(true);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zepChat) return;

    try {
      const response = await updateZepchat({
        zepchatId: zepChat._id,
        title: editTitle,
        content: editContent,
        tags: editTags.split(",").map((tag) => tag.trim()),
      });

      if (response.status === 200) {
        setZepChat({
          ...zepChat,
          title: editTitle,
          content: editContent,
          tags: editTags.split(",").map((tag) => tag.trim()),
        });
        setShowEditModal(false);
        toast.success("ZepChat updated successfully");
      } else {
        toast.error("Failed to update ZepChat");
      }
    } catch (error) {
      console.error("Error updating ZepChat:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!zepChat) return;
    if (window.confirm("Are you sure you want to delete this ZepChat?")) {
      try {
        const response = await deleteZepchat({
          zepchatId: zepChat._id,
          userId: userInfo.userId,
        });
        if (response.status === 200) {
          toast.success("ZepChat deleted successfully");
          navigate("/zepchats");
        } else {
          toast.error(response.data);
        }
      } catch (error) {
        console.error("Error deleting ZepChat:", error);
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zepChat) return;

    try {
      const response = await reportZepchat({
        zepchatId: zepChat._id,
        userId: userInfo.userId,
        subject: reportSubject,
        reason: reportReason,
      });

      if (response.status === 200) {
        setShowReportModal(false);
        toast.success("Report submitted successfully");
      } else {
        toast.error("Failed to submit report");
      }
    } catch (error) {
      console.error("Error reporting ZepChat:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-ff5f09"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!zepChat) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">ZepChat not found.</p>
      </div>
    );
  }

  const isAuthor = zepChat.author._id === userInfo.userId;

  return (
    <div className="flex h-full ml-0 lg:ml-64">
      <div className="w-full p-6 overflow-y-auto pb-24">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="text-gray-400 hover:text-white mr-4 transition-colors duration-300"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="text-white text-3xl font-bold">{zepChat.title}</h2>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              <EllipsisVerticalIcon className="w-6 h-6" />
            </button>
            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
                {isAuthor && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Delete
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowReportModal(true)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Report
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          {/* Main ZepChat */}
          <div className="bg-gray-800 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-ff5f09/30 border border-gray-700 hover:border-ff5f09">
            <div className="flex items-center mb-4">
              <img
                src={zepChat.author.profilePicture}
                alt={zepChat.author.displayName}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <span className="text-white font-semibold text-lg">
                  {zepChat.author.displayName}
                </span>
                <p className="text-gray-400 text-sm">
                  {new Date(zepChat.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {zepChat.content}
            </p>
            <div className="flex items-center mb-4">
              <button
                onClick={() => handleVoteZepChat("upVote")}
                className={`flex items-center mr-6 transition-colors duration-300 ${
                  hasUserVoted(zepChat, "upVote")
                    ? "text-ff5f09"
                    : "text-gray-400 hover:text-ff5f09"
                }`}
              >
                <ArrowUpIcon className="w-6 h-6 mr-2" />
                <span className="text-lg">{zepChat.upVotes}</span>
              </button>
              <button
                onClick={() => handleVoteZepChat("downVote")}
                className={`flex items-center transition-colors duration-300 ${
                  hasUserVoted(zepChat, "downVote")
                    ? "text-ff5f09"
                    : "text-gray-400 hover:text-ff5f09"
                }`}
              >
                <ArrowDownIcon className="w-6 h-6 mr-2" />
                <span className="text-lg">{zepChat.downVotes}</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {zepChat.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-gray-700 text-gray-300 rounded-full px-3 py-1 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <ZepChatReplies zepChatId={zepChat._id} />
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 rounded-lg p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-2xl font-bold">Edit ZepChat</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label htmlFor="editTitle" className="block text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="editTitle"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ff5f09"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="editContent"
                  className="block text-gray-300 mb-2"
                >
                  Content
                </label>
                <textarea
                  id="editContent"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-ff5f09"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="editTags" className="block text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="editTags"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ff5f09"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-ff5f09 text-white py-2 px-4 rounded-lg hover:bg-orange-700 focus:outline-none transition-colors duration-300"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 rounded-lg p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-2xl font-bold">Report ZepChat</h2>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleReportSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="reportSubject"
                  className="block text-gray-300 mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="reportSubject"
                  value={reportSubject}
                  onChange={(e) => setReportSubject(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ff5f09"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="reportReason"
                  className="block text-gray-300 mb-2"
                >
                  Reason
                </label>
                <textarea
                  id="reportReason"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-ff5f09"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-ff5f09 text-white py-2 px-4 rounded-lg hover:bg-orange-700 focus:outline-none transition-colors duration-300"
              >
                Submit Report
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZepChatView;
