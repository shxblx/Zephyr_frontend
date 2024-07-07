import React from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  UsersIcon,
  CurrencyDollarIcon,
  FlagIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";

const profitData = [
  { name: "Jan", profit: 4000 },
  { name: "Feb", profit: 3000 },
  { name: "Mar", profit: 5000 },
  { name: "Apr", profit: 4500 },
  { name: "May", profit: 6000 },
  { name: "Jun", profit: 5500 },
];

const recentUsers = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com" },
];

const recentReports = [
  { id: 1, title: "Inappropriate content", user: "Alice" },
  { id: 2, title: "Spam in community", user: "Charlie" },
  { id: 3, title: "Harassment report", user: "David" },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={<UsersIcon className="w-8 h-8" />}
          title="Total Users"
          value="10,234"
        />
        <StatCard
          icon={<ChatBubbleLeftRightIcon className="w-8 h-8" />}
          title="Total Communities"
          value="1,532"
        />
        <StatCard
          icon={<CurrencyDollarIcon className="w-8 h-8" />}
          title="Total Profit"
          value="₹152,345"
        />
        <StatCard
          icon={<FlagIcon className="w-8 h-8" />}
          title="Total Reports"
          value="3,421"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Profit Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={profitData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
          <ul>
            {recentUsers.map((user) => (
              <li key={user.id} className="mb-2">
                <span className="font-medium">{user.name}</span> - {user.email}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
          <ul>
            {recentReports.map((report) => (
              <li key={report.id} className="mb-2">
                <span className="font-medium">{report.title}</span> - reported
                by {report.user}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
          <ul>
            {recentReports.map((report) => (
              <li key={report.id} className="mb-2">
                <span className="font-medium">{report.title}</span> - reported
                by {report.user}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
      <div className="mr-4 text-ff5f09">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
