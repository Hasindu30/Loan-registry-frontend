import React, { useState } from 'react';
import { useAuth } from '../../context/authContext';
import { useSidebar } from '../../context/SidebarContext';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react'; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isHovered } = useSidebar();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    logout(); // clear user + remove token
    navigate('/login'); // go to login page
  };

  const openConfirm = () => setShowConfirm(true);
  const closeConfirm = () => setShowConfirm(false);

  return (
    <>
      {/* Navbar */}
      <div
        className={`fixed top-0 right-0 z-30 h-16 bg-white shadow-sm 
          flex items-center justify-between px-6 transition-all duration-300
          ${isHovered ? 'ml-64 w-[calc(100%-16rem)]' : 'ml-20 w-[calc(100%-5rem)]'}
        `}
      >
        <div className="flex items-center gap-4">
          <p className="text-gray-700 font-medium">Welcome, {user?.name}</p>
        </div>
        <div>
          <button
            onClick={openConfirm}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70  flex justify-center items-center">
          <div className="relative bg-white p-10 rounded-xl w-full max-w-[490px] shadow-2xl text-center animate-fadeIn">
            {/* Close icon */}
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-2 right-4 text-gray-500 hover:text-red-600 text-2xl"
            >
              &times;
            </button>

            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Are you sure want to logout?</h2>
            <p className="text-gray-600 mb-6">This action will end your current session.</p>

            <div className="flex justify-center gap-14">
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded text-md  transition"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded text-md transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
