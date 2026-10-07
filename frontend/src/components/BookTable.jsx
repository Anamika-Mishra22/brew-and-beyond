import React, { useState, useEffect } from 'react';
import { FaPlay, FaTimes, FaHourglassHalf, FaCalendarAlt, FaUsers, FaChair, FaCoffee } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookTable = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateTime: '',
    guests: '2 Persons',
    seating: 'Window View',
    specialRequest: ''
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || user.username || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setBookingSuccess(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data.message || 'Failed to submit reservation. Please try again.');
      }
    } catch (err) {
      console.error("Booking error:", err);
      setErrorMessage('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto relative overflow-hidden">
      
      {/* Ambient Theme Glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="grid lg:grid-cols-12 gap-16 items-center relative z-10">
        
        {/* LEFT SIDE: CAFE AMBIANCE IMAGE WITH PLAY VIDEO BUTTON (5 cols) */}
        <div className="lg:col-span-5 relative group rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)] border border-[#d4af37]/30">
          <img
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800"
            alt="Cafe Interior"
            className="w-full h-[580px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2d1b12] via-[#2d1b12]/40 to-transparent flex flex-col items-center justify-end pb-12 px-6 gap-5">
            <button
              onClick={() => setIsVideoOpen(true)}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#e6c567] hover:from-[#e5c158] hover:to-[#f3d98a] text-[#0f0a07] flex items-center justify-center text-xl shadow-[0_0_30px_rgba(212,175,55,0.45)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
              aria-label="Play Cafe Tour Video"
            >
              <FaPlay className="ml-1 text-base text-[#0f0a07]" />
            </button>
            <div className="text-center">
              <span className="text-[10px] font-serif uppercase tracking-[0.3em] text-[#d4af37] block mb-1 font-semibold">
                Atmosphere & Craft
              </span>
              <span className="text-sm font-serif tracking-wide text-[#f7ebd9]">
                Watch Cafe Experience
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: TABLE BOOKING FORM (7 cols) */}
        <div className="lg:col-span-7 text-[#4a2e1b] relative">
          
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <FaCoffee className="text-[#8c5830] text-xs" />
              <span className="text-xs font-serif italic text-[#8c5830] tracking-widest uppercase">
                Reserve Your Experience
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#2d1b12] font-normal tracking-wide">
              Book A Table Online
            </h2>
            <div className="w-20 h-[2px] bg-gradient-to-r from-[#8c5830] to-transparent mt-3"></div>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-xl text-red-800 text-xs tracking-wide shadow-sm">
              {errorMessage}
            </div>
          )}

          {bookingSuccess ? (
            <div className="bg-[#f3e9dc] border border-[#d4af37]/40 rounded-2xl py-12 px-8 text-center space-y-6 animate-fadeIn relative shadow-xl">
              <button
                onClick={() => setBookingSuccess(false)}
                className="absolute top-4 right-4 text-[#4a2e1b] hover:text-black bg-[#e6d5c3] p-2.5 rounded-full transition-colors cursor-pointer border border-[#d4af37]/30"
                aria-label="Close"
              >
                <FaTimes className="w-4 h-4 text-[#8c5830]" />
              </button>

              <div className="w-16 h-16 bg-[#e6d5c3] text-[#8c5830] rounded-full flex items-center justify-center mx-auto text-xl shadow-inner border border-[#d4af37]/50">
                <FaHourglassHalf className="animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2d1b12]">Spot Requested – Waiting for Confirmation!</h3>
                <p className="text-xs sm:text-sm text-[#4a2e1b] leading-relaxed max-w-md mx-auto font-serif">
                  Your table request is currently <span className="text-[#2d1b12] font-bold underline decoration-[#8c5830]">Pending Confirmation</span>. Track its live status in your <span className="italic font-bold">My Bookings</span> dashboard.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-3">
                <button
                  onClick={() => navigate('/myreservation')}
                  className="bg-gradient-to-r from-[#d4af37] to-[#c5a059] hover:from-[#e5c158] hover:to-[#d4af37] text-[#0f0a07] text-xs font-bold px-6 py-3.5 rounded-xl transition-all shadow-md uppercase tracking-wider cursor-pointer"
                >
                  View My Bookings
                </button>
                <button
                  onClick={() => {
                    setBookingSuccess(false);
                    setFormData(prev => ({ ...prev, dateTime: '', specialRequest: '' }));
                  }}
                  className="bg-[#e6d5c3] hover:bg-[#d9c4ad] text-[#2d1b12] text-xs font-medium px-6 py-3.5 rounded-xl transition-all shadow-sm uppercase tracking-wider cursor-pointer border border-[#d4af37]/30"
                >
                  Book Another Table
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-serif uppercase tracking-wider text-[#6b4423] mb-2 font-semibold">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-[#d2b48c]  border border-[#975f16] text-xs text-[#2d1b12] placeholder-[#9c7c5c] focus:outline-none focus:border-[#8c5830] focus:ring-2 focus:ring-[#8c5830]/20 transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-serif uppercase tracking-wider text-[#6b4423] mb-2 font-semibold">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-[#d2b48c]  border border-[#a2620e] text-xs text-[#2d1b12] placeholder-[#9c7c5c] focus:outline-none focus:border-[#8c5830] focus:ring-2 focus:ring-[#8c5830]/20 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-serif uppercase tracking-wider text-[#6b4423] mb-2 font-semibold flex items-center gap-1.5">
                    <FaCalendarAlt className="text-xs text-[#8c5830]" /> Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="dateTime"
                    value={formData.dateTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 rounded-xl  bg-[#d2b48c]  border border-[#a2620e] text-xs text-[#2d1b12] focus:outline-none focus:border-[#8c5830] focus:ring-2 focus:ring-[#8c5830]/20 transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-serif uppercase tracking-wider text-[#6b4423] mb-2 font-semibold flex items-center gap-1.5">
                    <FaUsers className="text-xs text-[#8c5830]" /> Guests
                  </label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#d2b48c]  border border-[#a2620e] text-xs text-[#2d1b12] focus:outline-none focus:border-[#8c5830] focus:ring-2 focus:ring-[#8c5830]/20 transition-all shadow-sm cursor-pointer"
                  >
                    <option value="1 Person" className="bg-[#d2b48c]">1 Person</option>
                    <option value="2 Persons" className="bg-[#d2b48c]">2 Persons</option>
                    <option value="3-4 Persons" className="bg-[#d2b48c]">3-4 Persons</option>
                    <option value="5+ Large Group" className="bg-[#d2b48c] ">5+ Large Group</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-serif uppercase tracking-wider text-[#6b4423] mb-2 font-semibold flex items-center gap-1.5">
                  <FaChair className="text-xs text-[#8c5830]" /> Seating Preference
                </label>
                <select
                  name="seating"
                  value={formData.seating}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl  bg-[#d2b48c]  border border-[#a2620e] text-xs text-[#2d1b12] focus:outline-none focus:border-[#8c5830] focus:ring-2 focus:ring-[#8c5830]/20 transition-all shadow-sm cursor-pointer"
                >
                  <option value="Window View" className="bg-[#d2b48c]">🪟 Window View (Cozy Lighting)</option>
                  <option value="Outdoor Terrace" className="bg-[#d2b48c]">🌿 Outdoor Terrace</option>
                  <option value="Private Lounge" className="bg-[#d2b48c]">🛋️ Private Lounge</option>
                  <option value="Center Dining" className="bg-[#d2b48c]">☕ Center Dining</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-serif uppercase tracking-wider text-[#6b4423] mb-2 font-semibold">Special Requests (Optional)</label>
                <textarea
                  name="specialRequest"
                  rows="3"
                  value={formData.specialRequest}
                  onChange={handleChange}
                  placeholder="e.g., Anniversary, Birthday, High Chair..."
                  className="w-full px-4 py-3.5 rounded-xl  bg-[#d2b48c]  border border-[#a2620e] text-xs text-[#2d1b12] placeholder-[#9c7c5c] focus:outline-none focus:border-[#8c5830] focus:ring-2 focus:ring-[#8c5830]/20 transition-all resize-none shadow-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#4a2c11] to-[#4a2c10]  hover:from-[#c0702f] hover:to-[#512704] disabled:opacity-50 text-[#f7ebd9] font-bold rounded-xl shadow-[0_4px_25px_rgba(212,175,55,0.35)] uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                {loading ? 'Submitting Request...' : '➔ SUBMIT TABLE REQUEST'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* VIDEO POPUP MODAL */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f0a07]/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl aspect-video bg-[#140d08] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.3)] border border-[#d4af37]/50">
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 text-[#f7ebd9] bg-[#2d1f14] hover:bg-[#3d2817] p-3 rounded-full z-10 transition-colors cursor-pointer shadow-lg border border-[#d4af37]/40"
              aria-label="Close modal"
            >
              <FaTimes className="w-4 h-4 text-[#d4af37]" />
            </button>

            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/5BS2YfqH550?autoplay=1"
              title="Cafe Ambiance Experience"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
};

export default BookTable;