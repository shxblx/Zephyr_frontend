import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  to: string[];
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, text, to, active }) => (
  <Link
    to={to[0]}
    className={`flex items-center justify-center p-2 rounded-lg ${
      active
        ? "bg-ff5f09 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`}
  >
    <div className="w-6 h-6">{icon}</div>
    <span className="font-orbitron hidden lg:inline ml-3">{text}</span>
    {active && (
      <div className="w-1 h-6 bg-white rounded-full ml-3 hidden lg:block"></div>
    )}
  </Link>
);

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { icon: <HomeIcon />, text: "Discover", to: ["/home"] },
    {
      icon: <UserGroupIcon />,
      text: "Friends",
      to: ["/friends", "/findfriends"],
    },
    { icon: <GlobeAltIcon />, text: "Communities", to: ["/communities"] },
    { icon: <ChatBubbleLeftRightIcon />, text: "Zepchats", to: ["/zepchats"] },
    { icon: <QuestionMarkCircleIcon />, text: "Support", to: ["/support"] },
  ];

  const isActive = (paths: string[]) =>
    paths.some((path) => location.pathname === path);

  return (
    <>
      {/* Mobile Sidebar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-black z-50 border-t border-gray-700">
        <ul className="flex justify-around py-2">
          {navItems.map((item) => (
            <li key={item.text}>
              <NavItem
                icon={item.icon}
                text={item.text}
                to={item.to}
                active={isActive(item.to)}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block text-white font-semibold w-64 flex-shrink-0 h-screen overflow-y-auto fixed left-0 top-16 z-20 bg-black">
        <nav className="mt-8">
          <ul className="space-y-2 px-4">
            {navItems.map((item) => (
              <li key={item.text}>
                <NavItem
                  icon={item.icon}
                  text={item.text}
                  to={item.to}
                  active={isActive(item.to)}
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
