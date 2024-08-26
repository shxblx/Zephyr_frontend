import React, { useState, useEffect } from "react";
import { EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import Loader from "../../components/common/admin/Loader";
import { toast } from "react-hot-toast";

// You'll need to create these API functions
import { getTickets, updateTicketStatus } from "../../api/admin";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

interface Ticket {
  _id: string;
  userId: {
    _id: string;
    userName: string;
  };
  subject: string;
  description: string;
  status: "Pending" | "InProgress" | "Solved";
  created: string;
  adminReplies?: Array<{ Reply: string }>;
  __v: number;
  userName: string;
}

const AdminTickets: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Pending" | "InProgress" | "Solved">("Pending");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, activeTab, searchTerm]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await getTickets();
      if (response.status === 200 && Array.isArray(response.data)) {
        setTickets(response.data);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setError("Failed to fetch tickets. Please try again later.");
      toast.error("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = tickets.filter((ticket) => ticket.status === activeTab);
    if (searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredTickets(filtered);
  };

  const handleViewTicket = (ticket: Ticket) => {
    Swal.fire({
      title: "Ticket Details",
      html: `
        <p><strong>User Name:</strong> ${ticket.userName || 'N/A'}</p>
        <p><strong>Subject:</strong> ${ticket.subject || 'N/A'}</p>
        <p><strong>Description:</strong> ${ticket.description || 'N/A'}</p>
        <p><strong>Status:</strong> ${ticket.status || 'N/A'}</p>
        <p><strong>Created At:</strong> ${ticket.created ? new Date(ticket.created).toLocaleString() : 'N/A'}</p>
        ${ticket.adminReplies && ticket.adminReplies.length > 0 ? `
          <p><strong>Admin Replies:</strong></p>
          ${ticket.adminReplies.map(reply => `<p>${reply.Reply}</p>`).join('')}
        ` : '<p>No admin replies yet.</p>'}
      `,
      icon: "info",
      showCancelButton: true,
      cancelButtonText: "Close",
      confirmButtonText: getNextStatusButtonText(ticket.status),
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        handleUpdateStatus(ticket);
      }
    });
  };

  const getNextStatusButtonText = (currentStatus: string) => {
    switch (currentStatus) {
      case "Pending":
        return "Mark as In Progress";
      case "InProgress":
        return "Mark as Solved";
      default:
        return "Close Ticket";
    }
  };

  const handleUpdateStatus = (ticket: Ticket) => {
    let newStatus: "Pending" | "InProgress" | "Solved";
    switch (ticket.status) {
      case "Pending":
        newStatus = "InProgress";
        break;
      case "InProgress":
        newStatus = "Solved";
        break;
      default:
        newStatus = "Solved";
    }

    Swal.fire({
      title: "Update Ticket Status",
      input: "textarea",
      inputLabel: "Admin Comments",
      inputPlaceholder: "Enter your comments here...",
      showCancelButton: true,
      confirmButtonText: "Update Status",
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        updateTicketStatusAPI(ticket._id, newStatus, result.value);
      }
    });
  };

  const updateTicketStatusAPI = async (
    ticketId: string,
    newStatus: string,
    adminComments: string
  ) => {
    try {
      const response = await updateTicketStatus({
        ticketId,
        newStatus,
        adminComments,
      });
      if (response.status === 200) {
        toast.success("Ticket status updated successfully");
        fetchTickets(); // Refresh the tickets list
      } else {
        toast.error("Failed to update ticket status");
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast.error("An error occurred while updating the ticket status");
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

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 shadow-md overflow-hidden p-5 rounded-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 p-4 text-white">
            Ticket Management
          </h1>

          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tickets..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-4">
            <button
              className={`px-4 py-2 mr-2 rounded ${
                activeTab === "Pending"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
              onClick={() => setActiveTab("Pending")}
            >
              Pending
            </button>
            <button
              className={`px-4 py-2 mr-2 rounded ${
                activeTab === "InProgress"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
              onClick={() => setActiveTab("InProgress")}
            >
              In Progress
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "Solved"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
              onClick={() => setActiveTab("Solved")}
            >
              Solved
            </button>
          </div>

          {/* Tickets Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">User Name</th>
                  <th className="px-4 py-2 text-left">Subject</th>
                  <th className="px-4 py-2 text-left">Created At</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket._id} className="border-b border-gray-700">
                    <td className="px-4 py-2">{ticket.userName}</td>
                    <td className="px-4 py-2">{ticket.subject}</td>
                    <td className="px-4 py-2">
                      {new Date(ticket.created).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleViewTicket(ticket)}
                        className="text-blue-500 hover:text-blue-600"
                        title="View Ticket"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTickets.length === 0 && (
            <div className="text-center py-4 text-white">
              <p>No tickets found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTickets;