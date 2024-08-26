import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { raiseTicket } from "../../../api/user";
import { useSelector } from "react-redux";

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

interface RaiseTicketProps {
  onClose: () => void;
  onSubmit: (ticket: Ticket) => void;
}

const RaiseTicket: React.FC<RaiseTicketProps> = ({ onClose, onSubmit }) => {
  const { userInfo } = useSelector((state: any) => state.userInfo);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await raiseTicket({
        userId: userInfo.userId,
        subject,
        description,
      });

      if (response.status === 200 && response.data) {
        const newTicket: Ticket = {
          _id: response.data._id || `temp-${Date.now()}`,
          userId: userInfo.userId,
          subject: subject,
          description: description,
          status: response.data.status || "Pending",
          created: response.data.created || new Date().toISOString(),
          __v: response.data.__v || 0,
          adminReplies: [], // Initialize with an empty array
        };

        onSubmit(newTicket);
        toast.success("Ticket submitted successfully");
        onClose();
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      toast.error("Failed to submit ticket. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-900 rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-2xl font-bold">Raise a Ticket</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="subject" className="block text-gray-300 mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff5f09]"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#ff5f09]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#ff5f09] text-white py-2 px-4 rounded-lg hover:bg-orange-700 focus:outline-none transition-colors duration-300"
          >
            Submit Ticket
          </button>
        </form>
      </div>
    </div>
  );
};

export default RaiseTicket;
