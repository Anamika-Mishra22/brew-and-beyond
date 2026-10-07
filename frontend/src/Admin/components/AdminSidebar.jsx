import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaThLarge, FaUtensils, FaClipboardList, FaUsers, FaSignOutAlt, FaCoffee, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaThLarge /> },
    { name: 'Live Orders', path: '/admin/orders', icon: <FaClipboardList /> },
    { name: 'Reservations', path: '/admin/reservations', icon: <FaCalendarAlt /> },
    { name: 'Menu Items', path: '/admin/menu', icon: <FaUtensils /> },
    { name: 'User', path: '/admin/Users', icon: <FaUsers /> },
  ];

  return (
    <aside className="w-64 bg-[#2b180a] text-[#f7ebd9] flex flex-col justify-between p-5 shadow-2xl h-screen sticky top-0 border-r border-[#4a2c11]/80 shrink-0 font-sans">
      <div>
        {/* Brand Header */}
        <div className="mb-8 px-2 flex items-center gap-3 border-b border-[#4a2c11] pb-5">
          <div className="w-11 h-11 bg-[#4a2c11] text-[#f7ebd9] rounded-xl flex items-center justify-center text-xl shadow-inner border border-[#6b3e15]">
            <FaCoffee />
          </div>
          <div>
            <h1 className="text-base font-serif font-bold text-[#f7ebd9] tracking-wide">
              Brew & Beyond
            </h1>
            <p className="text-[10px] text-[#c4a98a] font-semibold tracking-widest uppercase">Admin Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2.5 font-medium">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#4a2c11] text-[#fff5e6] font-bold shadow-md border border-[#6b3e15] translate-x-1'
                    : 'text-[#d4be9f] hover:bg-[#3d230e] hover:text-[#f7ebd9]'
                }`
              }
            >
              <span className="text-lg opacity-90">{item.icon}</span>
              <span className="text-xs">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          logout();
          navigate('/login');
        }}
        className="w-full flex items-center justify-center gap-2 bg-[#3d230e] hover:bg-rose-950 text-[#f7ebd9] hover:text-rose-200 font-semibold py-3 rounded-xl border border-[#4a2c11] transition duration-200 shadow-sm cursor-pointer text-xs uppercase tracking-wider"
      >
        <FaSignOutAlt className="text-rose-400" />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default AdminSidebar;