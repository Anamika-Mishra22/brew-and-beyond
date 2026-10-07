import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaUsers,
  FaClipboardList,
  FaRupeeSign,
  FaStore,
  FaMotorcycle,
  FaClock,
  FaPercent,
  FaCoffee,
} from 'react-icons/fa';

const Dashboard = () => {
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    customers: 0,
    products: 0,
    orders: 0,
    pendingOrders: 0,
    totalRevenue: '₹0',
    
    // Static Cafe Metrics
    cafeOutlets: 4,
    baristas: 12,
    deliveryRiders: 18,
    onlineSales: '₹56,685.10',
    takeawaySales: '₹18,223.20',
    cafeCommission: '₹10,556.20',
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/admin/dashboard-stats', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success && data.stats) {
          setStatsData((prevStats) => ({
            ...prevStats,
            ...data.stats,
          }));
        }
      } catch (error) {
        console.log("Error binding live stats:", error);
      }
    };

    fetchDashboardStats();
  }, []);

  const stats = [
    // ☕ Live Dynamic Cafe Stats (Fixed statsData.totalUsers)
    { title: 'Total Users', value: statsData.customers, icon: <FaUsers />, bg: 'bg-[#f7ebd9] text-[#4a2c11] border-[#c4a98a]' },
    { title: 'Coffee & Food Items', value: statsData.products, icon: <FaCoffee />, bg: 'bg-[#f7ebd9] text-[#4a2c11] border-[#c4a98a]' },
    { title: 'Total Cafe Orders', value: statsData.orders, icon: <FaClipboardList />, bg: 'bg-[#f7ebd9] text-[#4a2c11] border-[#c4a98a]' },
    { title: 'Pending Brews', value: statsData.pendingOrders, icon: <FaClock />, bg: 'bg-amber-100 text-amber-900 border-amber-300' },
    { title: 'Total Revenue', value: statsData.totalRevenue, icon: <FaRupeeSign />, bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    { title: 'Online Orders', value: statsData.onlineSales, icon: <FaRupeeSign />, bg: 'bg-[#f7ebd9] text-[#4a2c11] border-[#c4a98a]' },

    // 🔒 Brew & Beyond Operations (Static)
    { title: 'Active Outlets', value: statsData.cafeOutlets, icon: <FaStore />, bg: 'bg-stone-200 text-stone-800 border-stone-300' },
    { title: 'Baristas & Staff', value: statsData.baristas, icon: <FaUsers />, bg: 'bg-stone-200 text-stone-800 border-stone-300' },
    { title: 'Delivery Partners', value: statsData.deliveryRiders, icon: <FaMotorcycle />, bg: 'bg-stone-200 text-stone-800 border-stone-300' },
    { title: 'Takeaway Revenue', value: statsData.takeawaySales, icon: <FaRupeeSign />, bg: 'bg-stone-200 text-stone-800 border-stone-300' },
    { title: 'Platform Fee', value: statsData.cafeCommission, icon: <FaPercent />, bg: 'bg-stone-200 text-stone-800 border-stone-300' },
  ];

  return (
    <div className="space-y-6 font-sans text-[#3a200a]">
      <div className="flex justify-between items-center border-b border-[#c4a98a]/50 pb-4">
        <div>
          <h1 className="text-3xl font-serif text-[#2e1806] font-normal">Brew & Beyond Overview</h1>
          <p className="text-xs text-[#52371e] font-medium mt-1">Real-time cafe metrics & operations dashboard</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {stats.map((item, index) => (
          <div 
            key={index} 
            className="bg-[#e4cfb6] p-5 rounded-lg shadow-md border border-[#c4a98a] hover:shadow-lg transition-all duration-200 flex items-center justify-between"
          >
            <div>
              <p className="text-[11px] text-[#613e1c] font-semibold uppercase tracking-wider">{item.title}</p>
              <h2 className="text-2xl font-black text-[#2e1806] mt-1 font-serif">{item.value}</h2>
            </div>
            <div className={`w-12 h-12 rounded-lg border flex items-center justify-center text-xl shadow-inner ${item.bg}`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;