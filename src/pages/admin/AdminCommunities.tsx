import React, { useState, useEffect } from "react";
import { CheckCircleIcon, NoSymbolIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import Loader from "../../components/common/admin/Loader";
import { toast } from "react-hot-toast";
import {
  AdminGetCommunities,
  banCommunity,
  unbanCommunity,
} from "../../api/admin";

interface Community {
  _id: string;
  name: string;
  description: string;
  hashtags: string[];
  isPrivate: boolean;
  isBanned: boolean;
  profilePicture?: string;
  createdBy: string;
  createdAt: Date;
}

const AdminCommunities: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await AdminGetCommunities();
        if (response && response.data) {
          setCommunities(response.data || []);
        } else {
          toast.error("Failed to fetch communities.");
        }
      } catch (error) {
        console.error("Error fetching communities:", error);
        toast.error("Failed to fetch communities.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  const handleBanCommunity = async (_id: string, communityName: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ban the community "${communityName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, ban it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await banCommunity({ communityId: _id });

        if (response.status === 200) {
          setCommunities((prevCommunities) =>
            prevCommunities.map((community) =>
              community._id === _id
                ? { ...community, isBanned: true }
                : community
            )
          );
          Swal.fire(
            "Banned!",
            `The community "${communityName}" has been banned.`,
            "success"
          );
        } else {
          Swal.fire("Error!", "Failed to ban the community.", "error");
        }
      } catch (error) {
        console.error("Error banning community:", error);
        Swal.fire(
          "Error!",
          "An error occurred while banning the community.",
          "error"
        );
      }
    }
  };

  const handleUnbanCommunity = async (_id: string, communityName: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to unban the community "${communityName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, unban it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await unbanCommunity({ communityId: _id });

        if (response.status === 200) {
          setCommunities((prevCommunities) =>
            prevCommunities.map((community) =>
              community._id === _id
                ? { ...community, isBanned: false }
                : community
            )
          );
          Swal.fire(
            "Unbanned!",
            `The community "${communityName}" has been unbanned.`,
            "success"
          );
        } else if (response.status === 404) {
          Swal.fire("Error!", "Community not found.", "error");
        } else {
          Swal.fire("Error!", "Failed to unban the community.", "error");
        }
      } catch (error) {
        console.error("Error unbanning community:", error);
        Swal.fire(
          "Error!",
          "An error occurred while unbanning the community.",
          "error"
        );
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 shadow-md overflow-hidden p-5 rounded-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 p-4 text-white">
            Community Management
          </h1>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Community</th>
                  <th className="px-4 py-2 text-left hidden md:table-cell">
                    Description
                  </th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left hidden md:table-cell">
                    Created At
                  </th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {communities.length > 0 ? (
                  communities.map((community) => (
                    <tr
                      key={community._id}
                      className="border-b border-gray-700"
                    >
                      <td className="px-4 py-2">
                        <div className="flex items-center">
                          {community.profilePicture && (
                            <img
                              src={community.profilePicture}
                              alt={community.name}
                              className="w-12 h-12 rounded-full mr-4 object-cover"
                            />
                          )}
                          <div>
                            <div>{community.name}</div>
                            <div className="text-sm text-gray-400 md:hidden">
                              {community.description.substring(0, 50)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 hidden md:table-cell">
                        {community.description.substring(0, 100)}...
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            community.isBanned ? "bg-red-500" : "bg-green-500"
                          }`}
                        >
                          {community.isBanned ? "Banned" : "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-2 hidden md:table-cell">
                        {new Date(community.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex space-x-2">
                          {community.isBanned ? (
                            <button
                              onClick={() =>
                                handleUnbanCommunity(
                                  community._id,
                                  community.name
                                )
                              }
                              className="text-green-500 hover:text-green-600"
                              title="Unban Community"
                            >
                              <CheckCircleIcon className="h-6 w-6 md:h-8 md:w-8" />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleBanCommunity(
                                  community._id,
                                  community.name
                                )
                              }
                              className="text-red-500 hover:text-red-600"
                              title="Ban Community"
                            >
                              <NoSymbolIcon className="h-6 w-6 md:h-8 md:w-8" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-2 text-center">
                      No communities available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCommunities;
