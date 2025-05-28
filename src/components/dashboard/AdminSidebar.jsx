// components/AdminSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Building, Calendar, DollarSign, Settings } from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';

const menuItems = [
  { name: 'Dashboard', icon: <Home size={25} />, path: '/admin-dashboard' },
  { name: 'Customers Loan', icon: <Users size={25} />, path: '/customer' },
  { name: 'Finance', icon: <DollarSign size={25} />, path: '/finance' },
  { name: 'Settings', icon: <Settings size={25} />, path: '/admin/settings' },
];

const AdminSidebar = () => {
  const { isHovered, setIsHovered } = useSidebar();

  return (
    <div
      className={`fixed top-0 left-0 z-50 h-screen bg-zinc-800 text-white shadow-md transition-all duration-300 ease-in-out overflow-hidden ${isHovered ? 'w-64' : 'w-20'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        {isHovered && <span className="text-lg font-bold">Admin Panel</span>}
      </div>

      <nav className="flex flex-col gap-1 px-3 py-4">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-2 rounded-md transition-all duration-200 hover:bg-gray-800 ${
                isActive ? 'bg-gray-800 font-semibold' : ''
              }`
            }
          >
            <span>{item.icon}</span>
            {isHovered && <span className="text-sm">{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
