import React from 'react';
import { useAuth } from '../context/authContext';
import AdminSidebar from '../components/dashboard/AdminSidebar';
import Navbar from '../components/dashboard/Navbar';
import { useSidebar } from '../context/SidebarContext';
import {
  Users, Building2, DollarSign, BarChart2, PieChart, Settings
} from 'lucide-react';
import DonutChart from '../components/dashboard/charts/DonutCharts';
import LineChartComponent from '../components/dashboard/charts/LineChart';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isHovered } = useSidebar();

  // Summary Card
const SummaryCard = ({ title, value, icon, color }) => (
  <div className={`p-5 rounded-md shadow-sm text-white flex items-center gap-4 ${color}`}>
    <div className="bg-white/20 p-2 rounded-full">{icon}</div>
    <div>
      <h2 className="text-sm">{title}</h2>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  </div>
);

// Dummy Data
const projectData = [
  { id: 1, name: 'Website Redesign', priority: 'High', status: 'In Progress', progress: 60 },
  { id: 2, name: 'API Migration', priority: 'Normal', status: 'Completed', progress: 100 },
  { id: 3, name: 'Dashboard Update', priority: 'Low', status: 'Pending', progress: 30 },
  { id: 4, name: 'Email Server Setup', priority: 'High', status: 'Testing', progress: 75 },
];

const priorityColors = {
  High: 'bg-red-500',
  Normal: 'bg-yellow-500',
  Low: 'bg-green-500',
};

const statusColors = {
  'In Progress': 'bg-blue-500',
  Completed: 'bg-green-600',
  Pending: 'bg-yellow-600',
  Testing: 'bg-purple-600',
};


  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <AdminSidebar />
      
      <div className={`flex-1 transition-all duration-300 ${isHovered ? 'ml-64' : 'ml-20'}`}>
        <Navbar />
        
        {/* Dashboard Content */}
        <div className="p-6 mt-12 space-y-6 w-full overflow-x-hidden">
          {/* Heading */}
          <h1 className="text-3xl font-bold">Dashboard</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard title="Total Employees" value="128" icon={<Users size={24} />} color="bg-blue-600" />
            <SummaryCard title="Departments" value="12" icon={<Building2 size={24} />} color="bg-indigo-600" />
            <SummaryCard title="Monthly Pay" value="$124,500" icon={<DollarSign size={24} />} color="bg-green-600" />
            <SummaryCard title="Leave Requests" value="35" icon={<Settings size={24} />} color="bg-yellow-600" />
          </div>

          {/* Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-md shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Visitors Overview</h2>
                <BarChart2 size={20} className="text-gray-500" />
              </div>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <LineChartComponent />
              </div>
            </div>

            <div className="bg-white p-4 rounded-md shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Sales by Category</h2>
                <PieChart size={20} className="text-gray-500" />
              </div>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <DonutChart />
              </div>
            </div>
          </div>

          {/* Project Table */}
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">Project Progress</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">ID</th>
                    <th>Project</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {projectData.map((proj, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-2">{proj.id}</td>
                      <td>{proj.name}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-white text-xs ${priorityColors[proj.priority]}`}>
                          {proj.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-white text-xs ${statusColors[proj.status]}`}>
                          {proj.status}
                        </span>
                      </td>
                      <td>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${proj.progress}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};



export default AdminDashboard;
