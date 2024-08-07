import React, { useState, useEffect } from "react";
import { ExclamationTriangleIcon, EyeIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import Loader from "../../components/common/admin/Loader";
import { toast } from "react-hot-toast";
import { getReports, blockUser } from "../../api/admin";
import { AxiosResponse } from "axios";

interface Report {
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

const AdminReports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response: AxiosResponse = await getReports();
        if (response.status === 200 && Array.isArray(response.data)) {
          setReports(response.data);
        } else {
          throw new Error("Invalid data format received from API");
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
        setError("Failed to fetch reports. Please try again later.");
        toast.error("Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleViewReport = (reportId: string) => {
    const report = reports.find((r) => r._id === reportId);
    if (report) {
      Swal.fire({
        title: "Report Details",
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

  if (reports.length === 0) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no reports to display at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 shadow-md overflow-hidden p-5 rounded-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 p-4 text-white">
            Report Management
          </h1>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Reporter</th>
                  <th className="px-4 py-2 text-left">Reported User</th>
                  <th className="px-4 py-2 text-left">Subject</th>
                  <th className="px-4 py-2 text-left">Created At</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report._id} className="border-b border-gray-700">
                    <td className="px-4 py-2">{report.reporterUser}</td>
                    <td className="px-4 py-2">{report.reportedUser}</td>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
