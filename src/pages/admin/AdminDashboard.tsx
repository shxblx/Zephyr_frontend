import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { UsersIcon, FlagIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { getDashboardData } from "../../api/admin";

interface User {
  _id: string;
  userName: string;
  displayName: string;
  email: string;
}

interface Community {
  _id: string;
  name: string;
  description: string;
}

interface Report {
  _id: string;
  subject: string;
  reporterUser: string;
}

interface DashboardData {
  users: {
    total: number;
    users: User[];
  };
  communities: Community[];
  reports: Report[];
}

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    users: { total: 0, users: [] },
    communities: [],
    reports: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardData();
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const graphData = [
    { name: "Users", value: dashboardData.users.total },
    { name: "Communities", value: dashboardData.communities.length },
    { name: "Reports", value: dashboardData.reports.length },
  ];

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard
          icon={<UsersIcon className="w-8 h-8" />}
          title="Total Users"
          value={dashboardData.users.total.toLocaleString()}
        />
        <StatCard
          icon={<UserGroupIcon className="w-8 h-8" />}
          title="Total Communities"
          value={dashboardData.communities.length.toLocaleString()}
        />
        <StatCard
          icon={<FlagIcon className="w-8 h-8" />}
          title="Total Reports"
          value={dashboardData.reports.length.toLocaleString()}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
          <ul>
            {dashboardData.users.users.slice(0, 5).map((user) => (
              <li key={user._id} className="mb-2">
                <span className="font-medium">{user.displayName}</span> -{" "}
                {user.email}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Communities</h2>
          <ul>
            {dashboardData.communities.slice(0, 5).map((community) => (
              <li key={community._id} className="mb-2">
                <span className="font-medium">{community.name}</span> -{" "}
                {community.description}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
          <ul>
            {dashboardData.reports.slice(0, 5).map((report) => (
              <li key={report._id} className="mb-2">
                <span className="font-medium">{report.subject}</span> - reported
                by {report.reporterUser}
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
