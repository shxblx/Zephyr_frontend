import React, { useState, useEffect } from "react";
import { ExclamationTriangleIcon, EyeIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import Loader from "../../components/common/admin/Loader";
import { toast } from "react-hot-toast";
import {
  getReports,
  blockUser,
  getCommunityReports,
  banCommunity,
} from "../../api/admin";

interface UserReport {
  _id: string;
  reporterId: string;
  reportedUserId: string;
  reportedUser: string;
  reporterUser: string;
  subject: string;
  reason: string;
  createdAt: string;
  __v: number;
}

interface CommunityReport {
  _id: string;
  reporterId: string;
  reportedCommunityId: string;
  reportedCommunity: string;
  reporterUser: string;
  subject: string;
  reason: string;
  createdAt: string;
  __v: number;
}

const AdminReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"user" | "community">("user");
  const [userReports, setUserReports] = useState<UserReport[]>([]);
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [userResponse, communityResponse] = await Promise.all([
        getReports(),
        getCommunityReports(),
      ]);

      if (userResponse.status === 200 && Array.isArray(userResponse.data)) {
        setUserReports(userResponse.data);
      }

      if (
        communityResponse.status === 200 &&
        Array.isArray(communityResponse.data)
      ) {
        setCommunityReports(communityResponse.data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      setError("Failed to fetch reports. Please try again later.");
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const handleViewUserReport = (reportId: string) => {
    const report = userReports.find((r) => r._id === reportId);
    if (report) {
      Swal.fire({
        title: "User Report Details",
        html: `
          <p><strong>Reporter:</strong> ${report.reporterUser} (${
          report.reporterId
        })</p>
          <p><strong>Reported User:</strong> ${report.reportedUser} (${
          report.reportedUserId
        })</p>
          <p><strong>Subject:</strong> ${report.subject}</p>
          <p><strong>Reason:</strong> ${report.reason}</p>
          <p><strong>Created At:</strong> ${new Date(
            report.createdAt
          ).toLocaleString()}</p>
        `,
        icon: "info",
        showCancelButton: true,
        cancelButtonText: "Close",
        confirmButtonText: "Block User",
        confirmButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          handleBlockUser(report.reportedUserId);
        }
      });
    }
  };

  const handleViewCommunityReport = (reportId: string) => {
    const report = communityReports.find((r) => r._id === reportId);
    if (report) {
      Swal.fire({
        title: "Community Report Details",
        html: `
          <p><strong>Reporter:</strong> ${report.reporterUser} (${
          report.reporterId
        })</p>
          <p><strong>Reported Community:</strong> ${
            report.reportedCommunity
          } (${report.reportedCommunityId})</p>
          <p><strong>Subject:</strong> ${report.subject}</p>
          <p><strong>Reason:</strong> ${report.reason}</p>
          <p><strong>Created At:</strong> ${new Date(
            report.createdAt
          ).toLocaleString()}</p>
        `,
        icon: "info",
        showCancelButton: true,
        cancelButtonText: "Close",
        confirmButtonText: "Ban Community",
        confirmButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          handleBanCommunity(report.reportedCommunityId);
        }
      });
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      const response = await blockUser({ userId });
      if (response.status === 200) {
        toast.success("User blocked successfully");
      } else {
        toast.error("Failed to block user");
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      toast.error("An error occurred while blocking the user");
    }
  };

  const handleBanCommunity = async (communityId: string) => {
    try {
      const response = await banCommunity({ communityId });
      if (response.status === 200) {
        toast.success("Community banned successfully");
      } else {
        toast.error("Failed to ban community");
      }
    } catch (error) {
      console.error("Error banning community:", error);
      toast.error("An error occurred while banning the community");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  const renderReportsTable = (
    reports: UserReport[] | CommunityReport[],
    handleViewReport: (id: string) => void
  ) => {
    if (reports.length === 0) {
      return (
        <div className="text-center py-4">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no reports to display at this time.
          </p>
        </div>
      );
    }

    return (
      <table className="w-full text-white">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Reporter</th>
            <th className="px-4 py-2 text-left">
              {activeTab === "user" ? "Reported User" : "Reported Community"}
            </th>
            <th className="px-4 py-2 text-left">Subject</th>
            <th className="px-4 py-2 text-left">Created At</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report._id} className="border-b border-gray-700">
              <td className="px-4 py-2">{report.reporterUser}</td>
              <td className="px-4 py-2">
                {activeTab === "user"
                  ? (report as UserReport).reportedUser
                  : (report as CommunityReport).reportedCommunity}
              </td>
              <td className="px-4 py-2">{report.subject}</td>
              <td className="px-4 py-2">
                {new Date(report.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewReport(report._id)}
                    className="text-blue-500 hover:text-blue-600"
                    title="View Report"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 shadow-md overflow-hidden p-5 rounded-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 p-4 text-white">
            Report Management
          </h1>
          <div className="mb-4">
            <button
              className={`px-4 py-2 mr-2 rounded ${
                activeTab === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
              onClick={() => setActiveTab("user")}
            >
              User Reports
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "community"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
              onClick={() => setActiveTab("community")}
            >
              Community Reports
            </button>
          </div>
          <div className="overflow-x-auto">
            {activeTab === "user"
              ? renderReportsTable(userReports, handleViewUserReport)
              : renderReportsTable(communityReports, handleViewCommunityReport)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
