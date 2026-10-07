import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-stone-100 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm px-8 py-4 flex justify-between items-center border-b border-stone-200 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-stone-800 font-serif">Cafe Control Center</h2>
            <p className="text-xs text-stone-500">Manage orders, menu & operations</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-full uppercase tracking-wider">
              Super Admin
            </span>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-8 bg-amber-50/20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;