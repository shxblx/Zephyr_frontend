import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { useTransition, animated } from "react-spring";
import { getFriends, fetchMessages } from "../../../api/friends";
import FriendChat from "./FriendChat";
import socket from "../../../components/common/socket";

interface Friend {
  _id: string;
  userName: string;
  displayName: string;
  profilePicture: string;
  status: string;
  friendId: string;
  lastMessage?: {
    content: string;
    timestamp: string;
  };
}

interface Message {
  _id: string;
  conversationId: string;
  sender: string;
  content: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const MyFriends: React.FC = () => {
  const { userInfo } = useSelector((state: any) => state.userInfo);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [loading, setLoading] = useState(false);

  const sortFriends = useCallback((friendsToSort: Friend[]) => {
    return [...friendsToSort].sort((a: Friend, b: Friend) => {
      const aTimestamp = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : 0;
      const bTimestamp = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : 0;
      return bTimestamp - aTimestamp;
    });
  }, []);

  const transitions = useTransition(friends, {
    from: { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    enter: { opacity: 1, transform: 'translate3d(0,0px,0)' },
    leave: { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    keys: friend => friend._id,
    config: { tension: 220, friction: 20 },
  });

  useEffect(() => {
    fetchFriendsAndMessages();
    const storedFriend = localStorage.getItem("selectedFriend");
    if (storedFriend) {
      setSelectedFriend(JSON.parse(storedFriend));
    }

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);

  const handleNewMessage = useCallback((message: Message) => {
    setFriends(prevFriends => {
      const updatedFriends = prevFriends.map(friend => {
        if (friend._id === message.sender || friend._id === message.conversationId.replace(userInfo.userId, '').replace('-', '')) {
          return {
            ...friend,
            lastMessage: {
              content: message.content,
              timestamp: message.timestamp,
            },
          };
        }
        return friend;
      });
      return sortFriends(updatedFriends);
    });
  }, [userInfo.userId, sortFriends]);

  const fetchFriendsAndMessages = async () => {
    setLoading(true);
    try {
      const response = await getFriends(userInfo.userId);
      if (
        response &&
        response.data &&
        response.data.data &&
        response.data.data.friends
      ) {
        const friendsWithMessages = await Promise.all(
          response.data.data.friends.map(async (friend: Friend) => {
            const messages = await fetchMessages(userInfo.userId, friend._id);
            const lastMessage = messages.data[messages.data.length - 1];
            return {
              ...friend,
              lastMessage: lastMessage
                ? {
                    content: lastMessage.content,
                    timestamp: lastMessage.timestamp,
                  }
                : undefined,
            };
          })
        );

        setFriends(sortFriends(friendsWithMessages));
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      toast.error("No Friends Found, Add a Friend");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFriend = (friend: Friend) => {
    setSelectedFriend(friend);
    localStorage.setItem("selectedFriend", JSON.stringify(friend));
  };

  const handleBackClick = () => {
    setSelectedFriend(null);
    localStorage.removeItem("selectedFriend");
  };

  const handleRemoveFriend = (friendId: string) => {
    setFriends(prevFriends => sortFriends(prevFriends.filter((friend) => friend._id !== friendId)));
    setSelectedFriend(null);
    localStorage.removeItem("selectedFriend");
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] ml-0 lg:ml-64 bg-black overflow-hidden">
      <div
        className={`w-full lg:w-1/3 bg-black border-r border-gray-800 flex flex-col ${
          selectedFriend ? "hidden lg:flex" : "flex"
        }`}
      >
        <h2 className="text-white text-2xl font-semibold p-4">My Friends</h2>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#ff5f09]"></div>
            </div>
          ) : friends.length > 0 ? (
            <div className="space-y-4 p-4">
              {transitions((style, friend) => (
                <animated.div style={style} key={friend._id}>
                  <div
                    className={`rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedFriend?._id === friend._id
                        ? "border-2 border-[#ff5f09]"
                        : "border border-gray-700"
                    }`}
                    onClick={() => handleSelectFriend(friend)}
                  >
                    <div className="flex items-center">
                      <img
                        src={friend.profilePicture}
                        alt={friend.displayName}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h3 className="text-white text-lg font-semibold">
                            {friend.displayName}
                          </h3>
                          {friend.lastMessage && (
                            <span className="text-gray-400 text-xs">
                              {formatTimestamp(friend.lastMessage.timestamp)}
                            </span>
                          )}
                        </div>
                        {friend.lastMessage ? (
                          <p className="text-gray-500 text-sm truncate mt-1">
                            {friend.lastMessage.content}
                          </p>
                        ) : (
                          <p className="text-gray-500 text-sm mt-1">
                            No messages yet
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </animated.div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500">
              <p className="text-xl text-center">Add friends to start chatting</p>
            </div>
          )}
        </div>
      </div>
      <div
        className={`w-full lg:w-2/3 bg-black flex flex-col border-l border-gray-800 ${
          selectedFriend
            ? "flex"
            : "hidden lg:flex lg:items-center lg:justify-center"
        }`}
      >
        {selectedFriend ? (
          <FriendChat
            selectedFriend={selectedFriend}
            userInfo={userInfo}
            onBackClick={handleBackClick}
            onRemoveFriend={handleRemoveFriend}
            onNewMessage={handleNewMessage}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <ChatBubbleLeftRightIcon className="w-16 h-16 mb-4" />
            <p className="text-xl text-center">
              {friends.length > 0
                ? "Choose a friend to start chatting"
                : "Add friends to start chatting"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFriends;