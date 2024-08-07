// src/pages/admin/AdminUserDetails.tsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserDetails } from "../../api/admin"; // You'll need to create this function
import Loader from "../../components/common/admin/Loader";
import { toast } from "react-hot-toast";

interface UserDetails {
  _id: string;
  userName: string;
  displayName: string;
  email: string;
  wallet: number;
  status: string;
  isBlocked: boolean;
  isAdmin: boolean;
  joined_date: string;
  profilePicture: string;
}

const AdminUserDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;

      try {
        const response = await getUserDetails(userId);
        if (response && response.data) {
          setUserDetails(response.data);
        } else {
          toast.error("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("An error occurred while fetching user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return <Loader />;
  }

  if (!userDetails) {
    return <div>User not found</div>;
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 shadow-md overflow-hidden p-5 rounded-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 p-4 text-white">
            User Details
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
            <div className="col-span-2 flex justify-center">
              <img
                src={userDetails.profilePicture}
                alt={userDetails.displayName}
                className="w-32 h-32 rounded-full"
              />
            </div>
            <div>
              <strong>Username:</strong> {userDetails.userName}
            </div>
            <div>
              <strong>Display Name:</strong> {userDetails.displayName}
            </div>
            <div>
              <strong>Email:</strong> {userDetails.email}
            </div>
            <div>
              <strong>Wallet Balance:</strong> ${userDetails.wallet}
            </div>
            <div>
              <strong>Status:</strong> {userDetails.status}
            </div>
            <div>
              <strong>Blocked:</strong> {userDetails.isBlocked ? "Yes" : "No"}
            </div>
            <div>
              <strong>Admin:</strong> {userDetails.isAdmin ? "Yes" : "No"}
            </div>
            <div>
              <strong>Joined Date:</strong>{" "}
              {new Date(userDetails.joined_date).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetails;
