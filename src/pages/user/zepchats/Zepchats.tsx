import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import NewZepChat from "./NewZepChat";
import { getZepchats } from "../../../api/zepchat";

interface ZepChat {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    displayName: string;
    profilePicture: string;
  };
  timestamp: string;
  tags: string[];
  upVotes: number;
  downVotes: number;
}

const ZepChats: React.FC = () => {
  const [zepChats, setZepChats] = useState<ZepChat[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewZepChat, setShowNewZepChat] = useState(false);

  useEffect(() => {
    fetchZepChats();
  }, []);

  const fetchZepChats = async () => {
    setLoading(true);
    try {
      const response = await getZepchats();
      if (Array.isArray(response.data)) {
        setZepChats(response.data);
      } else {
        setZepChats([]);
      }
    } catch (error) {
      setZepChats([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredZepChats = Array.isArray(zepChats)
    ? zepChats.filter(
        (zepChat) =>
          zepChat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          zepChat.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          zepChat.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    : [];

  return (
    <div className="flex h-full ml-0 lg:ml-64">
      <div className="w-full p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-3xl font-bold">ZepChats</h2>
          <button
            onClick={() => setShowNewZepChat(true)}
            className="bg-ff5f09 text-white py-2 px-4  hover:bg-orange-700 focus:outline-none transition-colors duration-300"
          >
            New ZepChat
          </button>
        </div>
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search ZepChats..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full text-white bg-gray-800  px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-ff5f09"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-ff5f09"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredZepChats.map((zepChat) => (
              <Link to={`/zepchats/${zepChat._id}`} key={zepChat._id}>
                <div className="bg-gray-800  p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-ff5f09/30 border border-gray-700 hover:border-ff5f09">
                  <h3 className="text-white text-xl font-semibold mb-3">
                    {zepChat.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    {zepChat.content.substring(0, 150)}...
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <img
                        src={zepChat.author.profilePicture}
                        alt={zepChat.author.displayName}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <span className="text-gray-400 text-sm">
                        {zepChat.author.displayName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-400 text-sm">
                        {zepChat.upVotes} upvotes
                      </span>
                      <span className="text-gray-400 text-sm">
                        {zepChat.downVotes} downvotes
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {zepChat.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-gray-700 text-gray-300 rounded-full px-3 py-1 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      {showNewZepChat && (
        <NewZepChat
          onClose={() => setShowNewZepChat(false)}
          onSubmit={() => {
            setShowNewZepChat(false);
            fetchZepChats();
          }}
        />
      )}
    </div>
  );
};

export default ZepChats;
