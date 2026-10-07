import React, { useState, useEffect } from "react";
import socket from "../../socket"; 
import { FaClock, FaCheckCircle, FaMotorcycle, FaUtensils, FaConciergeBell, FaSync, FaShoppingBag } from "react-icons/fa";

const LiveOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    socket.on("new_order_placed", (newOrder) => {
      console.log("⚡ New Live Order Received:", newOrder);
      try {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
        audio.play().catch(e => console.log("Audio play blocked", e));
      } catch (err) {
        console.log("Audio error:", err);
      }

      setOrders((prevOrders) => [newOrder, ...prevOrders]);
    });

    return () => {
      socket.off("new_order_placed");
    };
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status })
      });
      const updatedOrder = await res.json();

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status } : o))
        );
        socket.emit("update_order_status", updatedOrder);
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === "All") return true;
    return (order.status || "Pending") === filter;
  });

  return (
    <div className="space-y-8 font-sans text-[#3a200a]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#c4a98a]/60 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#4a2c11] text-[#f7ebd9] flex items-center justify-center text-xl shadow-md border border-[#c4a98a]/40">
            <FaConciergeBell />
          </div>
          <div>
            <h1 className="text-3xl font-serif text-[#2e1806] font-normal tracking-wide">
              Live Cafe Orders 
            </h1>
            <p className="text-xs sm:text-sm text-[#52371e] mt-0.5">
              Monitor incoming brews, live kitchen status, and deliveries in real-time.
            </p>
          </div>
        </div>
        
        <button
          onClick={fetchOrders}
          className="bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] px-5 py-3 rounded-lg text-xs font-medium transition-all shadow-md flex items-center gap-2 cursor-pointer uppercase tracking-wider"
        >
          <FaSync className="animate-spin-hover" /> Refresh List
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2.5">
        {["All", "Pending", "Preparing", "Out for Delivery", "Delivered"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm ${
              filter === tab
                ? "bg-[#4a2c11] text-[#f7ebd9] shadow-md scale-[1.02]"
                : "bg-[#e4cfb6] text-[#3a200a] hover:bg-[#d5bc9f] border border-[#c4a98a]"
            }`}
          >
            {tab} <span className="ml-1 text-[10px] opacity-80">({tab === "All" ? orders.length : orders.filter(o => (o.status || "Pending") === tab).length})</span>
          </button>
        ))}
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="text-center py-24 text-[#613e1c] font-serif text-sm animate-pulse">
          Brewing order details...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-[#e4cfb6]/50 border border-dashed border-[#c4a98a] rounded-xl p-16 text-center space-y-3 shadow-inner">
          <div className="w-12 h-12 bg-[#4a2c11] text-[#f7ebd9] rounded-full flex items-center justify-center mx-auto text-lg shadow-sm">
            <FaShoppingBag />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#2e1806]">No Orders Found</h3>
          <p className="text-xs text-[#52371e]">No live orders match the status filter '{filter}'.</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-[#e4cfb6] border border-[#c4a98a] p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 text-[#3a200a]"
            >
              {/* Order Info */}
              <div className="space-y-2.5 flex-1">
                <div className="flex flex-wrap items-center gap-3 border-b border-[#c4a98a]/50 pb-3">
                  <span className="font-serif font-bold text-base text-[#2e1806] tracking-wide">
                    Order #{order._id?.slice(-6).toUpperCase()}
                  </span>
                  <span className="text-[11px] font-serif italic text-[#613e1c]">
                    Customer: <strong className="text-[#2e1806]">{order.user?.name || "Guest Customer"}</strong>
                  </span>
                  <span className="text-[11px] text-[#613e1c]">
                    • {new Date(order.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#52371e]">
                  <span className="bg-[#f0e2d1] px-2.5 py-1 rounded border border-[#c4a98a]/40 text-[#2e1806]">
                    Total: ₹{order.totalAmount}
                  </span>
                  <span>
                    Payment: <span className="uppercase text-[#2e1806]">{order.paymentMethod || "Online"}</span>
                  </span>
                </div>

                <div className="text-xs text-[#3a200a] bg-[#f0e2d1]/80 px-3.5 py-2.5 rounded-lg border border-[#c4a98a]/40">
                  <span className="font-bold text-[#2e1806]">Items Ordered:</span> {order.orderItems?.map((i) => `${i.name} (x${i.qty})`).join(", ")}
                </div>
              </div>

              {/* Status & Controls */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-[#c4a98a]/40">
                <span
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${
                    order.status === "Delivered"
                      ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                      : order.status === "Preparing"
                      ? "bg-amber-100 text-amber-900 border-amber-300"
                      : order.status === "Out for Delivery"
                      ? "bg-sky-100 text-sky-900 border-sky-300"
                      : "bg-[#f7ebd9] text-[#4a2c11] border-[#c4a98a]"
                  }`}
                >
                  {order.status === "Delivered" && <FaCheckCircle />}
                  {order.status === "Preparing" && <FaUtensils />}
                  {order.status === "Out for Delivery" && <FaMotorcycle />}
                  {(!order.status || order.status === "Pending") && <FaClock />}
                  {order.status || "Pending"}
                </span>

                <select
                  value={order.status || "Pending"}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="bg-white border border-[#c4a98a] text-xs font-semibold text-[#2e1806] rounded-lg px-3.5 py-2 outline-none focus:ring-2 focus:ring-[#4a2c11] cursor-pointer shadow-sm hover:border-[#4a2c11] transition-all"
                >
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveOrders;