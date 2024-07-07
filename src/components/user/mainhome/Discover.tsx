import React from "react";
import {
  UserGroupIcon,
  UserPlusIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

interface DiscoverItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

const Discover: React.FC = () => {
  const communities: DiscoverItem[] = [
    {
      id: 1,
      name: "Gaming Enthusiasts",
      description: "Join fellow gamers!",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTKfps2BYcm1T7oD3XmKS1DLeOLuNm13f2xQ&s",
    },
    {
      id: 2,
      name: "Tech Innovators",
      description: "Discuss the latest in tech",
      imageUrl:
        "https://www.91-cdn.com/hub/wp-content/uploads/2021/12/ar88u.jpg",
    },
  ];

  const friendSuggestions: DiscoverItem[] = [
    {
      id: 1,
      name: "Jane Doe",
      description: "3 mutual friends",
      imageUrl:
        "https://res.cloudinary.com/dsm0j8tzn/image/upload/v1720163434/_399e0eec-d6af-4840-8de3-0f8e60d8f9f1_wbqa0y.jpg",
    },
    {
      id: 2,
      name: "John Smith",
      description: "5 mutual friends",
      imageUrl:
        "https://res.cloudinary.com/dsm0j8tzn/image/upload/v1720163434/_399e0eec-d6af-4840-8de3-0f8e60d8f9f1_wbqa0y.jpg",
    },
  ];

  const zepChats: DiscoverItem[] = [
    {
      id: 1,
      name: "Coding Challenge",
      description: "Daily coding puzzles",
      imageUrl: "https://example.com/coding.jpg",
    },
    {
      id: 2,
      name: "Book Club",
      description: "Discuss this month's read",
      imageUrl: "https://example.com/book.jpg",
    },
  ];

  const renderCommunities = () => (
    <div className="p-4 mb-4 border-2 border-gray-600">
      <h2 className="text-white text-xl font-semibold mb-4 flex items-center">
        <UserGroupIcon className="w-6 h-6 mr-2" />
        Communities
      </h2>
      <div className="space-y-4 ">
        {communities.map((community) => (
          <div
            key={community.id}
            className="flex items-center space-x-4 border-2  border-gray-600 p-3"
          >
            <img
              src={community.imageUrl}
              alt={community.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="text-white font-semibold">{community.name}</h3>
              <p className="text-gray-300 text-sm">{community.description}</p>
            </div>
            <button className="ml-auto bg-ff5f09 text-white p-2 rounded-full hover:bg-ff5f09 transition-colors flex items-center">
              <PlusIcon className="w-5 h-5 mr-1" />
              Join
            </button>
          </div>
        ))}
      </div>
      <Link
        to="/communities"
        className="mt-4 inline-block text-white px-4 py-2 text-sm hover:bg-ff5f09 transition-colors"
      >
        View All Communities
      </Link>
    </div>
  );

  const renderFriendSuggestions = () => (
    <div className="p-4 mb-4 border-2  border-gray-600">
      <h2 className="text-white text-xl font-semibold mb-4 flex items-center ">
        <UserPlusIcon className="w-6 h-6 mr-2" />
        Friend Suggestions
      </h2>
      <div className="space-y-3 " >
        {friendSuggestions.map((friend) => (
          <div key={friend.id} className="flex items-center space-x-5">
            <img
              src={friend.imageUrl}
              alt={friend.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 ">
              <h3 className="text-white text-sm font-semibold">
                {friend.name}
              </h3>
              <p className="text-gray-300 text-xs">{friend.description}</p>
            </div>
            <button className="ml-auto bg-ff5f09 text-white p-2 rounded-full hover:bg-ff5f09 transition-colors">
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      <Link
        to="/friends"
        className="mt-4 inline-block text-white px-4 py-2 text-sm hover:bg-ff5f09 transition-colors"
      >
        View All Suggestions
      </Link>
    </div>
  );

  const renderZepChats = () => (
    <div className="p-4 border-2 border-gray-600 bg-gra">
      <h2 className="text-white text-xl font-semibold mb-4 flex items-center">
        <ChatBubbleLeftRightIcon className="w-6 h-6 mr-2" />
        ZepChats
      </h2>
      <div className="grid gap-4">
        {zepChats.map((chat) => (
          <div
            key={chat.id}
            className="bg-gray-800 p-3 flex items-center justify-between"
          >
            <div>
              <h3 className="text-white font-semibold">{chat.name}</h3>
              <p className="text-gray-300 text-sm">{chat.description}</p>
            </div>
            <button className="ml-auto bg-ff5f09 text-white p-2 rounded-full hover:bg-ff5f09 transition-colors flex items-center">
              <EyeIcon className="w-5 h-5 mr-1" />
              View
            </button>
          </div>
        ))}
      </div>
      <Link
        to="/zepchats"
        className="mt-4 inline-block text-white px-4 py-2 text-sm hover:bg-ff5f09 transition-colors"
      >
        View All ZepChats
      </Link>
    </div>
  );

  return (
    <div className="p-4 max-h-screen overflow-hidden bg-black text-white w-full max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Discover</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">{renderCommunities()}</div>
        <div className="md:col-span-1">{renderFriendSuggestions()}</div>
        <div className="md:col-span-3">{renderZepChats()}</div>
      </div>
    </div>
  );
};

export default Discover;
