import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import socket from '../socket';
import { FaBox, FaReceipt, FaFilter, FaSearch, FaSortAmountDown, FaCheckCircle, FaUtensils, FaMotorcycle, FaBoxOpen } from 'react-icons/fa';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 🔍 Filter & Search States
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'

  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders/myorders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setOrders(data);
        } else {
          setError(data.message || 'Orders load nahi ho paaye.');
        }
      } catch (err) {
        setError('Server se connect nahi ho pa raha hai.');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();

    socket.on('order_status_updated', (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id
            ? { ...order, status: updatedOrder.status }
            : order
        )
      );
    });

    return () => {
      socket.off('order_status_updated');
    };
  }, [token]);

  // 🛠️ Status Step Identifier Helper
  const getStepIndex = (status) => {
    switch (status) {
      case 'Placed': return 1;
      case 'Preparing': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      default: return 1;
    }
  };

  // 🛠️ Filter & Search Logic
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'All' || (order.status || 'Placed') === statusFilter;
    const orderIdMatch = order._id.toLowerCase().includes(searchQuery.toLowerCase());
    const itemNameMatch = order.orderItems?.some(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return matchesStatus && (orderIdMatch || itemNameMatch || searchQuery === '');
  }).sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-center font-serif text-[#4a2c11] text-lg bg-[#cca880] italic animate-pulse">
        Brewing your order history... ☕
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-center py-20 text-rose-950 font-medium bg-[#cca880]">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 bg-[#cca880]">
        <FaBox className="mx-auto text-5xl text-[#4a2c11] mb-4" />
        <h2 className="text-3xl font-serif text-[#2e1806] mb-2">You haven't placed any orders yet!</h2>
        <p className="text-[#52371e] text-sm mb-6 font-medium">Menu par jaayein aur apna favourite food order karein.</p>
        <Link to="/menu" className="bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] px-6 py-3 rounded-sm font-medium text-xs tracking-wider uppercase transition shadow-sm">
          View Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#cca880] text-[#3a200a] font-sans px-6 py-10 selection:bg-[#4a2c11] selection:text-white">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header & Controls Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#baa080] pb-6">
          <h1 className="text-3xl font-serif text-[#2e1806] flex items-center gap-3">
            <FaReceipt className="text-[#4a2c11]" /> My Order History & Tracking
          </h1>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#52371e]">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Search by Item or Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#e4cfb6] border border-[#c4a98a] text-xs rounded-sm pl-9 pr-4 py-2 text-[#2e1806] placeholder-[#613e1c] outline-none focus:ring-1 focus:ring-[#4a2c11]"
            />
          </div>
        </div>

        {/* Filters and Sorting Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#d8bc98]/40 p-3 rounded-sm border border-[#baa080]">
          
          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-[#52371e] flex items-center gap-1 mr-2">
              <FaFilter /> Status:
            </span>
            {['All', 'Placed', 'Preparing', 'Out for Delivery', 'Delivered'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-[#4a2c11] text-[#f7ebd9] shadow-sm'
                    : 'bg-[#e4cfb6] text-[#52371e] hover:bg-[#d8bc98]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#52371e] flex items-center gap-1">
              <FaSortAmountDown /> Sort:
            </span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-[#e4cfb6] border border-[#c4a98a] text-xs font-medium text-[#2e1806] rounded-sm px-3 py-1 outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-[#e4cfb6] p-12 rounded-sm text-center text-[#52371e] font-medium border border-[#c4a98a]">
            No matching orders found. Try changing your search or filter!
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const currentStep = getStepIndex(order.status || 'Placed');

              return (
                <div key={order._id} className="bg-[#e6d5bc] p-6 rounded-2xl shadow-lg border border-[#d2bba0] text-[#4a3525]">
                  
                  {/* Top Bar: Order ID, Date, Status Badge */}
                  <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#d2bba0]/60 mb-4 gap-4">
                    <div>
                      <span className="text-[11px] font-semibold tracking-wider text-[#7a5c44] uppercase block">ORDER ID</span>
                      <span className="font-bold text-sm sm:text-base">#{order._id}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-[#d8c2a8] px-3 py-1.5 rounded-full text-xs font-medium border border-[#cca88c]">
                        <span>📅</span>
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="bg-[#4a3525] text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-sm uppercase">
                        <span>☕</span> {order.status || 'Placed'}
                      </div>
                    </div>
                  </div>

                  {/* 🟢 LIVE ORDER TRACKING VISUAL PROGRESS BAR */}
                  <div className="bg-[#d8c2a8]/50 p-4 rounded-xl border border-[#cca88c] mb-6">
                    <p className="text-xs font-bold text-[#4a3525] uppercase tracking-wider mb-3">Live Order Status Tracker:</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                      {[
                        { title: 'Placed', icon: <FaBoxOpen /> },
                        { title: 'Preparing', icon: <FaUtensils /> },
                        { title: 'Out for Delivery', icon: <FaMotorcycle /> },
                        { title: 'Delivered', icon: <FaCheckCircle /> }
                      ].map((step, idx) => {
                        const stepNum = idx + 1;
                        const isCompleted = stepNum <= currentStep;

                        return (
                          <div key={idx} className={`flex flex-col items-center p-2 rounded-lg transition ${
                            isCompleted ? 'bg-[#4a3525] text-white shadow-sm' : 'bg-[#e4d5bc]/70 text-[#7a5c44]'
                          }`}>
                            <div className="text-base mb-1">{step.icon}</div>
                            <span className="text-[11px] font-semibold">{step.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Main Content Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                    
                    {/* Items Section */}
                    <div className="lg:col-span-2 space-y-3">
                      <div className="flex items-center gap-2 font-bold text-sm text-[#4a3525]">
                        <span>☕</span> Items Brewed & Ordered:
                      </div>
                      {order.orderItems?.map((item, idx) => {
                        const itemQty = item.qty || item.quantity || 1;
                        return (
                          <div key={idx} className="bg-[#d8c2a8]/60 px-4 py-3.5 rounded-xl flex items-center justify-between text-sm font-medium border border-[#cca88c]">
                            <span className="text-[#4a3525]">{item.name} × {itemQty}</span>
                            <span className="font-bold text-[#4a3525]">₹{item.price * itemQty}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Delivery Destination Box */}
                    <div className="bg-[#dfccb4]/50 p-4 rounded-xl border border-[#cca88c] space-y-3 text-xs">
                      <div>
                        <div className="font-bold flex items-center gap-1 text-[#4a3525] mb-1 text-sm">
                          <span>📍</span> Delivery Destination
                        </div>
                        <p className="text-[#5a4332] leading-relaxed">
                          {order.shippingAddress?.address || order.shippingAddress?.street}, {order.shippingAddress?.city}
                        </p>
                        <p className="text-[#5a4332] font-medium mt-1">Phone: {order.shippingAddress?.phone}</p>
                      </div>
                      
                      <div className="border-t border-[#cca88c]/70 pt-3 flex items-center justify-between font-bold text-sm text-[#4a3525]">
                        <span>Total Amount:</span>
                        <span>₹{order.totalAmount || order.totalPrice}</span>
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;