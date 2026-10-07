import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaUsers, FaChair, FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

const MyReservations = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserReservations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://brew-and-beyond.onrender.com/api/reservations/my-reservations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setReservations(response.data);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        setError("Could not fetch your bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserReservations();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Status ke hisaab se badge color aur icon return karne ke liye helper function
  const getStatusBadge = (status) => {
    const currentStatus = status ? status.toLowerCase() : 'pending';
    if (currentStatus === 'confirmed' || currentStatus === 'approved') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
          <FaCheckCircle /> Confirmed
        </span>
      );
    } else if (currentStatus === 'cancelled' || currentStatus === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-300">
          <FaTimesCircle /> Cancelled
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-900 border border-amber-300">
          <FaHourglassHalf className="animate-pulse" /> Pending Confirmation
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-b from-[#FAF6F0] via-[#F3EDE2] to-[#EAE0D0] text-[#3a200a]">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#c4a98a]/60 pb-6">
          <div>
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-xs font-serif italic text-[#613e1c] hover:text-[#2e1806] mb-2 transition-colors cursor-pointer"
            >
              <FaArrowLeft /> Back to Home
            </button>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#2e1806] font-normal">
              My Table Bookings 🍽️
            </h1>
            <p className="text-xs sm:text-sm text-[#52371e] mt-1">
              Track your cafe table booking requests, confirmation updates, and seating preferences in real-time.
            </p>
          </div>
          <button
  onClick={() => {
    navigate('/'); // Home page par bhejne ke liye
    setTimeout(() => {
      const element = document.getElementById('book');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); // Thoda delay taaki home page properly load ho jaye
  }}
  className="bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] text-xs font-medium px-5 py-3 rounded-sm transition-all shadow-md uppercase tracking-wider cursor-pointer"
>
  + Book New Table
</button>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="text-center py-20 text-[#613e1c] font-serif text-sm animate-pulse">
            Loading your bookings...
          </div>
        ) : error ? (
          <div className="bg-rose-100 border border-rose-300 text-rose-800 p-4 rounded-md text-center text-xs">
            {error}
          </div>
        ) : reservations.length === 0 ? (
          <div className="bg-[#e4cfb6]/60 border border-dashed border-[#c4a98a] rounded-lg p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-[#4a2c11] text-[#f7ebd9] rounded-full flex items-center justify-center mx-auto text-lg shadow-sm">
              <FaCalendarAlt />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#2e1806]">No Bookings Found</h3>
            <p className="text-xs text-[#52371e] max-w-sm mx-auto">
              You haven't requested any table bookings yet. Experience our cozy ambiance by booking a spot today!
            </p>
            {/* <button
              onClick={() => navigate('/')}
              className="mt-2 bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] text-xs font-medium px-5 py-2.5 rounded-sm transition-all shadow-sm uppercase tracking-wider cursor-pointer"
            >
              Explore & Book
            </button> */}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {reservations.map((item) => (
              <div 
                key={item._id || item.id} 
                className="bg-[#e4cfb6] border border-[#c4a98a] rounded-lg p-6 shadow-md hover:shadow-lg transition-all space-y-4 text-[#3a200a] relative"
              >
                {/* Top Row: Booking ID / Date created & Status Badge */}
                <div className="flex justify-between items-center border-b border-[#c4a98a]/50 pb-3">
                  <span className="text-[11px] font-serif italic text-[#613e1c]">
                    Booked on: {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                  {getStatusBadge(item.status)}
                </div>

                {/* Details Grid */}
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-[#2e1806]">
                    <FaCalendarAlt className="text-[#613e1c]" />
                    <span className="font-semibold">Date & Time:</span> 
                    <span>{item.dateTime ? new Date(item.dateTime).toLocaleString() : 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[#2e1806]">
                    <FaUsers className="text-[#613e1c]" />
                    <span className="font-semibold">Guests:</span> 
                    <span>{item.guests || '2 Persons'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[#2e1806]">
                    <FaChair className="text-[#613e1c]" />
                    <span className="font-semibold">Seating:</span> 
                    <span>{item.seating || 'Window View'}</span>
                  </div>

                  {item.specialRequest && (
                    <div className="pt-2 border-t border-[#c4a98a]/40 text-xs text-[#52371e]">
                      <span className="font-semibold text-[#2e1806]">Special Request:</span> {item.specialRequest}
                    </div>
                  )}
                </div>

                {/* Footer Note */}
                <div className="pt-2 text-[11px] text-[#613e1c] italic bg-[#f0e2d1] p-2.5 rounded border border-[#c4a98a]/30">
                  {item.status === 'Confirmed' || item.status === 'Approved' 
                    ? "✨ Your table is confirmed! We look forward to welcoming you."
                    : "⏳ Waiting for admin approval. You'll receive updates here and via email."}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyReservations;// (Aapke file mein export default MyReservations hoga)