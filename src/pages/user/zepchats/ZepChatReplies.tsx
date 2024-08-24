import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { getReplies, postReply, voteReply } from "../../../api/zepchat";
import { CSSTransition, TransitionGroup } from "react-transition-group";

interface Reply {
  _id: string;
  zepChatId: string;
  userId: string;
  content: string;
  profilePicture: string;
  displayName: string;
  upVotes: number;
  downVotes: number;
  upVoters: Voter[];
  downVoters: Voter[];
  createdAt: string;
  updatedAt: string;
}

interface Voter {
  userId: string;
  _id: string;
}

interface ZepChatRepliesProps {
  zepChatId: string;
}

const ZepChatReplies: React.FC<ZepChatRepliesProps> = ({ zepChatId }) => {
  const { userInfo } = useSelector((state: any) => state.userInfo);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const replyListRef = useRef<HTMLDivElement>(null);

  const fetchReplies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const repliesResponse = await getReplies(zepChatId);
      if (repliesResponse.status === 200) {
        setReplies(
          Array.isArray(repliesResponse.data)
            ? repliesResponse.data.sort(
                (a: any, b: any) =>
                  b.upVotes - b.downVotes - (a.upVotes - a.downVotes)
              )
            : []
        );
      } else {
        setReplies([]);
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
      setError("An error occurred while fetching replies. Please try again.");
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [zepChatId]);

  useEffect(() => {
    fetchReplies();
  }, [fetchReplies]);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newReply.trim()) {
      try {
        const response = await postReply({
          zepChatId,
          content: newReply.trim(),
          userId: userInfo.userId,
        });

        if (response.status === 201) {
          setNewReply("");
          toast.success("Reply posted successfully");
          fetchReplies();
        } else {
          console.log(response);
          
          toast.error("Failed to post reply");
        }
      } catch (error) {
        console.error("Error posting reply:", error);
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const handleVoteReply = async (
    replyId: string,
    voteType: "upVote" | "downVote"
  ) => {
    const reply = replies.find((r) => r._id === replyId);
    if (!reply) return;

    const userId = userInfo.userId;
    const hasUpvoted = reply.upVoters.some((voter) => voter.userId === userId);
    const hasDownvoted = reply.downVoters.some(
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
      const response = await voteReply({
        replyId,
        voteType: actualVoteType,
        userId: userId,
      });

      if (response.status === 200) {
        setReplies((prevReplies) => {
          const updatedReplies = prevReplies.map((r) => {
            if (r._id === replyId) {
              const updatedReply = { ...r };

              if (actualVoteType === "upVote") {
                updatedReply.upVotes++;
                updatedReply.upVoters.push({
                  userId,
                  _id: Date.now().toString(),
                });
                if (hasDownvoted) {
                  updatedReply.downVotes--;
                  updatedReply.downVoters = updatedReply.downVoters.filter(
                    (voter) => voter.userId !== userId
                  );
                }
              } else if (actualVoteType === "downVote") {
                updatedReply.downVotes++;
                updatedReply.downVoters.push({
                  userId,
                  _id: Date.now().toString(),
                });
                if (hasUpvoted) {
                  updatedReply.upVotes--;
                  updatedReply.upVoters = updatedReply.upVoters.filter(
                    (voter) => voter.userId !== userId
                  );
                }
              } else if (actualVoteType === "removeUpVote") {
                updatedReply.upVotes--;
                updatedReply.upVoters = updatedReply.upVoters.filter(
                  (voter) => voter.userId !== userId
                );
              } else if (actualVoteType === "removeDownVote") {
                updatedReply.downVotes--;
                updatedReply.downVoters = updatedReply.downVoters.filter(
                  (voter) => voter.userId !== userId
                );
              }

              return updatedReply;
            }
            return r;
          });

          return updatedReplies.sort(
            (a, b) => b.upVotes - b.downVotes - (a.upVotes - a.downVotes)
          );
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const hasUserVoted = (reply: Reply, voteType: "upVote" | "downVote") => {
    const voters = voteType === "upVote" ? reply.upVoters : reply.downVoters;
    return voters?.some((voter) => voter.userId === userInfo.userId) || false;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-ff5f09"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="flex flex-col h-full relative">
      <h3 className="text-white text-xl font-bold mb-4">Replies</h3>
      <div
        ref={replyListRef}
        className="flex-grow overflow-y-auto space-y-6 mb-20"
      >
        {replies.length === 0 ? (
          <p className="text-gray-400">
            No replies yet. Be the first to reply!
          </p>
        ) : (
          <TransitionGroup>
            {replies.map((reply) => (
              <CSSTransition key={reply._id} timeout={500} classNames="reply">
                <div className="bg-gray-800 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-ff5f09/30 border border-gray-700 hover:border-ff5f09">
                  <div className="flex items-center mb-4">
                    <img
                      src={reply.profilePicture}
                      alt={reply.displayName}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div>
                      <span className="text-white font-semibold">
                        {reply.displayName}
                      </span>
                      <p className="text-gray-400 text-sm">
                        {formatDate(reply.createdAt)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">{reply.content}</p>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleVoteReply(reply._id, "upVote")}
                      className={`flex items-center mr-4 transition-colors duration-300 ${
                        hasUserVoted(reply, "upVote")
                          ? "text-ff5f09"
                          : "text-gray-400 hover:text-ff5f09"
                      }`}
                    >
                      <ArrowUpIcon className="w-5 h-5 mr-1" />
                      <span>{reply.upVotes}</span>
                    </button>
                    <button
                      onClick={() => handleVoteReply(reply._id, "downVote")}
                      className={`flex items-center transition-colors duration-300 ${
                        hasUserVoted(reply, "downVote")
                          ? "text-ff5f09"
                          : "text-gray-400 hover:text-ff5f09"
                      }`}
                    >
                      <ArrowDownIcon className="w-5 h-5 mr-1" />
                      <span>{reply.downVotes}</span>
                    </button>
                  </div>
                </div>
              </CSSTransition>
            ))}
          </TransitionGroup>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-black p-4">
        <form onSubmit={handleSubmitReply} className="flex items-center">
          <input
            type="text"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Write your reply..."
            className="flex-grow bg-gray-800 text-white rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ff5f09"
          />
          <button
            type="submit"
            className="bg-ff5f09 text-white px-6 py-2 rounded-r-lg hover:bg-orange-700 focus:outline-none transition-colors duration-300"
          >
            Reply
          </button>
        </form>
      </div>
    </div>
  );
};

export default ZepChatReplies;
