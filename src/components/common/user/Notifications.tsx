import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import { clearNotifications, getNotification } from "../../../api/user";
import { acceptFriendRequest, rejectFriendRequest } from "../../../api/friends";
import toast from "react-hot-toast";
import io from "socket.io-client";

interface Notification {
  _id: string;
  category: "friends" | "community" | "zepchats" | "others";
  message: string;
  type?: string;
  timestamp: string;
  profile?: string;
}

interface NotificationsProps {
  isOpen: boolean;
  toggleNotifications: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ isOpen }) => {
  const [activeTab, setActiveTab] = useState<
    "friends" | "community" | "zepchats" | "others"
  >("friends");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { userInfo } = useSelector((state: any) => state.userInfo);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotification(userInfo.userId);
        console.log(response);

        if (
          response.status === 200 &&
          response.data &&
          Array.isArray(response.data.notifications)
        ) {
          const processedNotifications = response.data.notifications.map(
            (notification: Notification) => ({
              ...notification,
              category: notification.category,
            })
          );
          setNotifications(processedNotifications);
        } else {
          console.error("Failed to fetch notifications:", response);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, userInfo.userId]);

  useEffect(() => {
    const socket = io("http://your-socket-io-server-url");

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("newNotification", (newNotification: Notification) => {
      setNotifications((prevNotifications) => [
        newNotification,
        ...prevNotifications,
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleAcceptFriendRequest = async (
    notificationId: string,
    friendId: string,
    message: string
  ) => {
    try {
      const response = await acceptFriendRequest({
        userId: userInfo.userId,
        friendId: friendId,
      });
      setNotifications(notifications.filter((n) => n._id !== notificationId));
      if (response.status === 200) {
        const friendName = message.split(" ").pop();
        toast.success(`Added ${friendName} as Friend`);
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleRejectFriendRequest = async (notificationId: string) => {
    try {
      const response = await rejectFriendRequest({
        userId: userInfo.userId,
        friendId: notificationId,
      });

      if (response.status === 200) {
        setNotifications(notifications.filter((n) => n._id !== notificationId));

        const notification = notifications.find(
          (n) => n._id === notificationId
        );
        const friendName = notification
          ? notification.message.split(" ").pop()
          : "Friend";

        toast.success(`Friend request from ${friendName} rejected`);
      } else {
        toast.error("Failed to reject friend request. Please try again.");
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      toast.error("An error occurred while rejecting the friend request");
    }
  };

  const handleClearAllNotifications = async () => {
    const response = await clearNotifications({ userId: userInfo.userId });
    if (response.status === 200) {
      setNotifications([]);
      toast.success(response.data);
    } else {
      toast.error(response.data);
    }
  };

  const filteredNotifications = notifications.filter(
    (notification) => notification.category === activeTab
  );

  const notificationVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <div className="h-full flex flex-col w-full">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Notifications</h2>
      </div>
      <div className="flex space-x-2 p-2 border-b overflow-x-auto">
        {["friends", "community", "zepchats", "others"].map((tab) => (
          <motion.button
            key={tab}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === tab
                ? "bg-[#FF5F09] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <motion.div
                key={notification._id}
                variants={notificationVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white p-4 rounded-lg shadow"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {notification.profile ? (
                      <img
                        src={notification.profile}
                        alt="Profile"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                    {notification.type === "friendRequest" && (
                      <div className="mt-3 flex space-x-2">
                        <motion.button
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() =>
                            handleAcceptFriendRequest(
                              notification._id,
                              notification._id,
                              notification.message
                            )
                          }
                          className="bg-[#FF5F09] hover:bg-[#FF7F3F] text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                          Accept
                        </motion.button>
                        <motion.button
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() =>
                            handleRejectFriendRequest(notification._id)
                          }
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                          Decline
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-500 text-center"
            >
              No notifications
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      {notifications.length > 0 && (
        <div className="p-4 border-t">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleClearAllNotifications}
            className="w-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Clear All
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
