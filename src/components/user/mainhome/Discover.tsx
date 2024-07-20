import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import Communities from "./Dcommunities";
import FriendSuggestions from "./Dfriends";
import ZepChats from "./Dzepchats";

const Discover: React.FC = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const renderChatbotButton = () => (
    <div className="fixed left-10 bottom-4 z-50 lg:left-56">
      <button
        onClick={() => setIsChatbotOpen(!isChatbotOpen)}
        className="bg-ff5f09 text-white p-3 rounded-full hover:bg-ff5f09 transition-colors shadow-lg"
      >
        <FontAwesomeIcon icon={faRobot} className="text-xl" />
      </button>
      {isChatbotOpen && (
        <div className="absolute bottom-16 left-10 w-72 bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="bg-ff5f09 text-white p-3 flex justify-between items-center">
            <span>Chatbot</span>
            <button onClick={() => setIsChatbotOpen(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="h-64 overflow-y-auto p-3">
            <p className="text-white">Hello! How can I assist you today?</p>
          </div>
          <div className="p-3 border-t border-gray-700">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full bg-white text-black p-2 rounded"
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 max-h-screen bg-black text-white w-full">
      <h1 className="text-2xl font-bold mb-6">Discover</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Communities />
        </div>
        <div className="lg:col-span-1">
          <FriendSuggestions />
        </div>
        <div className="lg:col-span-3">
          <ZepChats />
        </div>
      </div>
      {renderChatbotButton()}
    </div>
  );
};

export default Discover;
