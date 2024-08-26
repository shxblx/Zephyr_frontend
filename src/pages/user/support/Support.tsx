import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { TicketIcon, UserCircleIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from "@heroicons/react/24/outline";
import RaiseTicket from "./RaiseTicket";
import { getTickets } from "../../../api/user";

interface AdminReply {
  _id: string;
  Reply: string;
}

interface Ticket {
  _id: string;
  userId: string;
  subject: string;
  description: string;
  status: string;
  created: string;
  __v: number;
  adminReplies: AdminReply[];
}

const Support: React.FC = () => {
  const { userInfo } = useSelector((state: any) => state.userInfo);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRaiseTicket, setShowRaiseTicket] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await getTickets(userInfo.userId);
      console.log(response);

      if (Array.isArray(response.data)) {
        setTickets(response.data);
      } else {
        console.error("Unexpected data structure:", response.data);
        toast.error("Unexpected data received from server");
        setTickets([]);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to load support tickets");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleBackClick = () => {
    setSelectedTicket(null);
  };

  const handleRaiseTicket = () => {
    setShowRaiseTicket(true);
  };

  const handleCloseRaiseTicket = () => {
    setShowRaiseTicket(false);
  };

  const handleTicketSubmitted = (newTicket: Ticket) => {
    setTickets([newTicket, ...tickets]);
    setShowRaiseTicket(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString(undefined, options);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'solved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'inprogress':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] ml-0 lg:ml-64 bg-black overflow-hidden">
      <div
        className={`w-full lg:w-1/3 bg-black border-r border-gray-800 flex flex-col ${
          selectedTicket ? "hidden lg:flex" : "flex"
        }`}
      >
        <h2 className="text-white text-2xl font-semibold p-4">
          Support Tickets
        </h2>
        <button
          onClick={handleRaiseTicket}
          className="bg-[#ff5f09] text-white px-4 py-2 rounded-lg mx-4 mb-4 hover:bg-orange-700 transition-colors"
        >
          Raise a Ticket
        </button>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#ff5f09]"></div>
            </div>
          ) : tickets.length > 0 ? (
            <div className="space-y-4 p-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className={`rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedTicket?._id === ticket._id
                      ? "border-2 border-[#ff5f09]"
                      : "border border-gray-700"
                  }`}
                  onClick={() => handleSelectTicket(ticket)}
                >
                  <h3 className="text-white text-lg font-semibold">
                    {ticket.subject}
                  </h3>
                  <div className="flex items-center text-gray-400 text-sm">
                    <span className="mr-2">Status:</span>
                    {getStatusIcon(ticket.status)}
                    <span className="ml-1">{ticket.status}</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Created: {formatDate(ticket.created)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500">
              <p className="text-xl text-center">No support tickets found</p>
            </div>
          )}
        </div>
      </div>
      <div
        className={`w-full lg:w-2/3 bg-black flex flex-col border-l border-gray-800 ${
          selectedTicket
            ? "flex"
            : "hidden lg:flex lg:items-center lg:justify-center"
        }`}
      >
        {selectedTicket ? (
          <div className="p-4 h-full flex flex-col">
            <button
              onClick={handleBackClick}
              className="text-white hover:text-gray-300 mb-4"
            >
              &larr; Back to Tickets
            </button>
            <h2 className="text-white text-2xl font-semibold mb-4">
              {selectedTicket.subject}
            </h2>
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <div className="flex items-center text-gray-400 text-sm mb-2">
                <span className="mr-2">Status:</span>
                {getStatusIcon(selectedTicket.status)}
                <span className="ml-1">{selectedTicket.status}</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">
                Created: {formatDate(selectedTicket.created)}
              </p>
              <p className="text-white">{selectedTicket.description}</p>
            </div>

            {/* Admin Replies Section */}
            <div className="flex-1 overflow-y-auto">
              <h3 className="text-white text-xl font-semibold mb-4">Admin Replies</h3>
              {selectedTicket.adminReplies && selectedTicket.adminReplies.length > 0 ? (
                <div className="space-y-4">
                  {selectedTicket.adminReplies.map((reply) => (
                    <div key={reply._id} className="p-4 rounded-lg bg-blue-900">
                      <div className="flex items-center mb-2">
                        <UserCircleIcon className="h-6 w-6 mr-2 text-blue-500" />
                        <span className="text-white font-semibold">Admin</span>
                        {/* Add timestamp if available in the future */}
                      </div>
                      <p className="text-white">{reply.Reply}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No admin replies yet.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <TicketIcon className="w-16 h-16 mb-4" />
            <p className="text-xl text-center">
              Select a ticket to view details
            </p>
          </div>
        )}
      </div>
      {showRaiseTicket && (
        <RaiseTicket
          onClose={handleCloseRaiseTicket}
          onSubmit={handleTicketSubmitted}
        />
      )}
    </div>
  );
};

export default Support;