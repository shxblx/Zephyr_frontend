// UserLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const UserLayout: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-3 pt-16"> 
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
