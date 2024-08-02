import React from "react";
import Discover from "../../components/user/mainhome/Discover";

export const MainHome: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-black">
      <div className="flex-1 w-full lg:ml-64">
        <div className="p-4 lg:p-8">
          <Discover />
        </div>
      </div>
    </div>
  );
};
