import React from "react";
import { ChatBubbleLeftRightIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

interface ZepChat {
  id: number;
  name: string;
  description: string;
}

const ZepChats: React.FC = () => {
  const zepChats: ZepChat[] = [
    {
      id: 1,
      name: "Coding Challenge",
      description: "Daily coding puzzles",
    },
    {
      id: 2,
      name: "Book Club",
      description: "Discuss this month's read",
    },
  ];

  return (
    <div className="p-4 border-2 border-gray-600">
      <h2 className="text-white text-xl font-semibold mb-4 flex items-center">
        <ChatBubbleLeftRightIcon className="w-6 h-6 mr-2" />
        ZepChats
      </h2>
      <div className="grid gap-4">
        {zepChats.map((chat) => (
          <div
            key={chat.id}
            className="border-2 border-gray-600 p-3 flex flex-col sm:flex-row items-center justify-between rounded-lg"
          >
            <div className="text-center sm:text-left mb-2 sm:mb-0">
              <h3 className="text-white font-semibold">{chat.name}</h3>
              <p className="text-gray-300 text-sm">{chat.description}</p>
            </div>
            <button className="bg-[#FF5F09] text-white p-2 rounded-full hover:bg-orange-600 transition-colors flex items-center">
              <EyeIcon className="w-5 h-5 mr-1" />
              View
            </button>
          </div>
        ))}
      </div>
      <Link
        to="/zepchats"
        className="mt-4 inline-block text-white px-4 py-2 text-sm bg-[#FF5F09] hover:bg-orange-600 transition-colors rounded"
      >
        View All ZepChats
      </Link>
    </div>
  );
};

export default ZepChats;
