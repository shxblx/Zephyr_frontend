import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { newZapchat } from "../../../api/zepchat";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

interface NewZepChatProps {
  onClose: () => void;
  onSubmit: () => void;
}

const NewZepChat: React.FC<NewZepChatProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const { userInfo } = useSelector((state: any) => state.userInfo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = userInfo.userId;

    const trimmedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .join(",");

    try {
      const response = await newZapchat({
        title,
        content,
        tags: trimmedTags,
        userId,
      });
      if (response.status === 201) {
        toast.success("ZepChat created successfully!");
        onSubmit();
      } else {
        toast.error("Failed to create ZepChat. Please try again.");
      }
    } catch (error) {
      console.error("Error creating ZepChat:", error);
      toast.error("An error occurred. Please try again.");
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-2xl font-bold">Create New ZepChat</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-300 mb-2">
              Subject Heading
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ff5f09"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-300 mb-2">
              Detailed Question
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-ff5f09"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="tags" className="block text-gray-300 mb-2">
              Hashtags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ff5f09"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-ff5f09 text-white py-2 px-4 rounded-lg hover:bg-orange-700 focus:outline-none transition-colors duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewZepChat;
