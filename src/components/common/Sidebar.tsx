import React from 'react';
import { 
  HomeIcon, 
  UserGroupIcon, 
  GlobeAltIcon, 
  ChatBubbleLeftRightIcon, 
  QuestionMarkCircleIcon 
} from '@heroicons/react/24/solid';

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, active }) => (
  <li className={`flex items-center p-2 rounded-lg ${active ? 'bg-ff5f09 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
    <div className="w-6 h-6 mr-3">
      {icon}
    </div>
    <span className="font-orbitron">{text}</span>
    {active && <div className="w-1 h-6 bg-white rounded-full ml-auto"></div>}
  </li>
);

const Sidebar: React.FC = () => {
  return (
    <div className="text-white font-semibold w-64 flex-shrink-0 h-screen overflow-y-auto transition-all duration-300 ease-in-out transform md:translate-x-0 -translate-x-full fixed md:relative z-30 left-0 top-0 pt-16 md:pt-0">
      <nav className="mt-8">
        <ul className="space-y-2 px-4">
          <SidebarItem icon={<HomeIcon />} text="Discover" active />
          <SidebarItem icon={<UserGroupIcon />} text="Friends" />
          <SidebarItem icon={<GlobeAltIcon />} text="Communities" />
          <SidebarItem icon={<ChatBubbleLeftRightIcon />} text="Zepchats" />
          <SidebarItem icon={<QuestionMarkCircleIcon />} text="Support" />
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;