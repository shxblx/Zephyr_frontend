import React from "react";
import { Link } from "react-router-dom";
import { UserGroupIcon, PlusIcon } from "@heroicons/react/24/outline";

interface DiscoverItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

const Communities: React.FC = () => {
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

  return (
    <div className="p-4 mb-4 border-2 border-gray-600">
      <h2 className="text-white text-xl font-semibold mb-4 flex items-center">
        <UserGroupIcon className="w-6 h-6 mr-2" />
        Communities
      </h2>
      <div className="space-y-4">
        {communities.map((community) => (
          <div
            key={community.id}
            className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 rounded-md border-2 border-gray-600 p-3"
          >
            <img
              src={community.imageUrl}
              alt={community.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-white font-semibold">{community.name}</h3>
              <p className="text-gray-300 text-sm">{community.description}</p>
            </div>
            <button className="bg-ff5f09 text-white p-2 rounded-full hover:bg-ff5f09 transition-colors flex items-center">
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
};

export default Communities;
