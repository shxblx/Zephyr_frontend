import React from 'react';
import { UserGroupIcon, UserPlusIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface DiscoverItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

const Discover: React.FC = () => {
  const communities: DiscoverItem[] = [
    { id: 1, name: 'Gaming Enthusiasts', description: 'Join fellow gamers!', imageUrl: 'https://example.com/gaming.jpg' },
    { id: 2, name: 'Tech Innovators', description: 'Discuss the latest in tech', imageUrl: 'https://example.com/tech.jpg' },
    // Add more communities as needed
  ];

  const friendSuggestions: DiscoverItem[] = [
    { id: 1, name: 'Jane Doe', description: '3 mutual friends', imageUrl: 'https://example.com/jane.jpg' },
    { id: 2, name: 'John Smith', description: '5 mutual friends', imageUrl: 'https://example.com/john.jpg' },
    // Add more friend suggestions as needed
  ];

  const zepChats: DiscoverItem[] = [
    { id: 1, name: 'Coding Challenge', description: 'Daily coding puzzles', imageUrl: 'https://example.com/coding.jpg' },
    { id: 2, name: 'Book Club', description: "Discuss this month's read", imageUrl: 'https://example.com/book.jpg' },
    // Add more ZepChats as needed
  ];

  const renderSection = (title: string, items: DiscoverItem[], icon: React.ReactNode) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className=" rounded-lg shadow-md overflow-hidden">
            <img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover" />
            <div className="p-4">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="">
      <div className="container ml-40 px-4 md:pl-24 lg:pl-32"> 
        <h1 className="text-4xl font-bold mb-8 text-ff5f09">Discover</h1>
        {renderSection('Communities', communities, <UserGroupIcon className="w-8 h-8 text-ff5f09" />)}
        {renderSection('Friend Suggestions', friendSuggestions, <UserPlusIcon className="w-8 h-8 text-ff5f09" />)}
        {renderSection('ZepChats', zepChats, <ChatBubbleLeftRightIcon className="w-8 h-8 text-ff5f09" />)}
      </div>
    </div>
  );
};

export default Discover;