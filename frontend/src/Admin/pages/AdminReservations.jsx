import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaTrash, FaCalendarAlt, FaUser, FaChair, FaSync, FaBookmark } from 'react-icons/fa';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // GET: Fetch reservations from backend
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://brew-and-beyond.onrender.com/api/reservations');
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      console.error('Failed to fetch reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // PUT: Update Status (Confirmed / Cancelled)
  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`https://brew-and-beyond.onrender.com/api/reservations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        setReservations(prev => 
          prev.map(item => item._id === id ? { ...item, status } : item)
        );
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  // DELETE: Remove Reservation
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reservation?')) return;

    try {
      const res = await fetch(` https://brew-and-beyond.onrender.com/api/reservations/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setReservations(prev => prev.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error('Delete action failed:', err);
    }
  };

  return (
    <div className="space-y-6 font-sans text-[#3a200a] min-h-screen">
      
      {/* TOP HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#c4a98a]/60 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#4a2c11] text-[#f7ebd9] flex items-center justify-center text-xl shadow-md border border-[#c4a98a]/40">
            <FaBookmark />
          </div>
          <div>
            <h1 className="text-3xl font-serif text-[#2e1806] font-normal tracking-wide">
              Table Reservations ☕
            </h1>
            <p className="text-xs sm:text-sm text-[#52371e] mt-0.5">
              Track and manage customer table booking requests in real-time.
            </p>
          </div>
        </div>

        <button 
          onClick={fetchReservations}
          className="bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] px-5 py-3 rounded-lg text-xs font-medium transition-all shadow-md flex items-center gap-2 cursor-pointer uppercase tracking-wider"
        >
          <FaSync className={loading ? 'animate-spin' : ''} /> Refresh List
        </button>
      </div>

      {/* CONTENT AREA */}
      {loading ? (
        <div className="text-center py-24 text-[#613e1c] font-serif text-sm animate-pulse">
          Loading table reservations...
        </div>
      ) : reservations.length === 0 ? (
        <div className="bg-[#e4cfb6]/50 border border-dashed border-[#c4a98a] rounded-xl p-16 text-center space-y-3 shadow-inner text-[#52371e]">
          <div className="w-12 h-12 bg-[#4a2c11] text-[#f7ebd9] rounded-full flex items-center justify-center mx-auto text-lg shadow-sm">
            <FaBookmark />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#2e1806]">No Bookings Found</h3>
          <p className="text-xs text-[#52371e]">No table reservations found in the system right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((item) => (
            <div 
              key={item._id} 
              className="bg-[#e4cfb6] border border-[#c4a98a] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6 text-[#3a200a]"
            >
              {/* Customer & Booking Details */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3 border-b border-[#c4a98a]/50 pb-3">
                  <h3 className="font-serif font-bold text-base text-[#2e1806] tracking-wide">
                    {item.name}
                  </h3>
                  <span className="text-xs text-[#613e1c] italic">({item.email})</span>
                  
                  {/* Status Tag */}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    item.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                    item.status === 'Cancelled' ? 'bg-rose-100 text-rose-900 border-rose-300' :
                    'bg-[#f7ebd9] text-[#4a2c11] border-[#c4a98a]'
                  }`}>
                    {item.status || 'Pending'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-6 text-xs text-[#52371e] font-semibold">
                  <span className="flex items-center gap-2">
                    <FaCalendarAlt className="text-[#613e1c]" /> 
                    {item.dateTime || 'N/A'}
                  </span>
                  <span className="flex items-center gap-2">
                    <FaUser className="text-[#613e1c]" /> 
                    {item.guests}
                  </span>
                  <span className="flex items-center gap-2">
                    <FaChair className="text-[#613e1c]" /> 
                    {item.seating}
                  </span>
                </div>

                {item.specialRequest && (
                  <div className="text-xs text-[#3a200a] bg-[#f0e2d1] px-3 py-2 rounded-lg border border-[#c4a98a]/40 inline-block">
                    <span className="font-semibold text-[#2e1806]">Special Request:</span> "{item.specialRequest}"
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#c4a98a]/40">
                {/* Confirm Button */}
                <button 
                  onClick={() => handleStatusChange(item._id, 'Confirmed')}
                  disabled={item.status === 'Confirmed' || item.status === 'Cancelled'}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                    item.status === 'Confirmed'
                      ? 'bg-emerald-700 text-white cursor-not-allowed opacity-90'
                      : item.status === 'Cancelled'
                      ? 'bg-[#d8c3ab] text-stone-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <FaCheck /> {item.status === 'Confirmed' ? 'Confirmed' : 'Confirm'}
                </button>

                {/* Cancel Button */}
                <button 
                  onClick={() => handleStatusChange(item._id, 'Cancelled')}
                  disabled={item.status === 'Confirmed' || item.status === 'Cancelled'}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    item.status === 'Cancelled'
                      ? 'bg-rose-700 text-white cursor-not-allowed opacity-90'
                      : item.status === 'Confirmed'
                      ? 'bg-[#d8c3ab] text-stone-400 cursor-not-allowed border border-[#c4a98a]'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300'
                  }`}
                >
                  <FaTimes /> {item.status === 'Cancelled' ? 'Cancelled' : 'Cancel'}
                </button>

                {/* Delete Button */}
                <button 
                  onClick={() => handleDelete(item._id)}
                  className="p-2.5 text-[#613e1c] hover:text-rose-700 hover:bg-[#f0e2d1] rounded-lg transition-all cursor-pointer border border-[#c4a98a]/40 bg-[#f0e2d1]/50"
                  title="Delete Record"
                >
                  <FaTrash />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminReservations;