import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import Communities from "./Dcommunities";
import FriendSuggestions from "./Dfriends";
import ZepChats from "./Dzepchats";
import { sendMessageToChatbot } from "../../../api/user";
import { useSelector } from "react-redux";
import { setUserLocation } from "../../../api/friends";

interface Message {
  text: string;
  isUser: boolean;
}

interface Location {
  latitude: number;
  longitude: number;
}

const Discover: React.FC = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I assist you today?", isUser: false },
  ]);

  const { userInfo } = useSelector((state: any) => state.userInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [decryptionText, setDecryptionText] = useState("");
  const [_location, setLocation] = useState<Location | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isChatbotOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      const possibleChars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
      interval = setInterval(() => {
        let result = "";
        for (let i = 0; i < 20; i++) {
          result += possibleChars.charAt(
            Math.floor(Math.random() * possibleChars.length)
          );
        }
        setDecryptionText(result);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    checkAndRequestLocationPermission();
  }, []);

  const checkAndRequestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          getCurrentPosition();
        } else if (result.state === "prompt") {
          requestLocationPermission();
        }
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const requestLocationPermission = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(newLocation);
        updateUserLocation(newLocation);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  };

  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(newLocation);
        updateUserLocation(newLocation);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  };

  const updateUserLocation = async (newLocation: Location) => {
    try {
      const response = await setUserLocation({
        userId: userInfo.userId,
        newLocation: newLocation,
      });
      if (response.status === 200) {
        setIsSuccessModalOpen(true);
      }
    } catch (error) {
      console.error("Error setting user location:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputMessage, isUser: true },
      ]);
      setInputMessage("");
      setIsLoading(true);

      try {
        const response = await sendMessageToChatbot({ message: inputMessage });
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: response.data, isUser: false },
        ]);
      } catch (error) {
        console.error("Error sending message to chatbot:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Sorry, there was an error processing your request.",
            isUser: false,
          },
        ]);
      } finally {
        setIsLoading(false);
        setDecryptionText("");
      }
    }
  };

  const renderChatbotButton = () => (
    <div className="fixed left-10 bottom-4 z-50 lg:left-56 ">
      <button
        onClick={() => setIsChatbotOpen(!isChatbotOpen)}
        className="bg-ff5f09 text-white p-3 rounded-full hover:bg-ff5f09 transition-colors shadow-lg"
      >
        <FontAwesomeIcon icon={faRobot} className="text-xl" />
      </button>
      {isChatbotOpen && (
        <div className="absolute bottom-16 left-10 w-96 bg-gray-800 rounded-lg shadow-xl overflow-hidden">
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
          <div
            ref={chatContainerRef}
            className="h-96 overflow-y-auto p-3 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  message.isUser ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    message.isUser
                      ? "bg-ff5f09 text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {message.text}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="text-left">
                <span className="inline-block p-2 rounded-lg bg-gray-700 text-ff5f09 font-mono text-sm transition-all duration-300 ease-in-out">
                  {decryptionText}
                </span>
              </div>
            )}
          </div>
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-gray-700 flex items-center"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow bg-white text-black p-2 rounded-l"
            />
            <button
              type="submit"
              className="bg-ff5f09 text-white p-2 rounded-r hover:bg-orange-600 transition-colors"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 max-h-screen bg-black text-white w-full -mt-10">
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
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">
              Location Set Successfully
            </h2>
            <p className="mb-4">Now you can find nearby gamers and friends!</p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="px-4 py-2 bg-ff5f09 text-white rounded hover:bg-orange-600 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;
