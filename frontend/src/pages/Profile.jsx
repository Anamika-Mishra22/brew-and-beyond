import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. useNavigate import karein
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // 2. Hook initialize karein
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('cafe_user')) || user;
    if (savedUser) {
      setFormData({
        name: savedUser.name || '',
        email: savedUser.email || '',
        phone: savedUser.phone || '',
        currentPassword: '',
        newPassword: ''
      });
    }
  }, [user]);

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    setTimeout(() => {
      try {
        const updatedUser = {
          ...(JSON.parse(localStorage.getItem('cafe_user')) || user),
          name: formData.name,
          phone: formData.phone
        };
        
        localStorage.setItem('cafe_user', JSON.stringify(updatedUser));

        setMessage({ type: 'success', text: 'Profile updated successfully! Redirecting...' });
        
        // 3. Success ke 1.5 seconds baad Home page ('/') par redirect kar dein
        setTimeout(() => {
          navigate('/'); 
        }, 1500);

      } catch (err) {
        setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#cca880] py-16 px-6">
      <div className="max-w-2xl mx-auto bg-[#e4cfb6] rounded-md p-8 md:p-10 shadow-xl border border-[#c4a98a] text-[#3a200a]">
        
        {/* Header */}
        <div className="flex items-center gap-4 pb-6 mb-8 border-b border-[#c4a98a]">
          <div className="w-16 h-16 rounded-full bg-[#4a2c11] text-[#f7ebd9] flex items-center justify-center font-serif font-bold text-2xl shadow-inner">
            {formData.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#2e1806]">Account Profile</h1>
            <p className="text-xs text-[#613e1c] font-light mt-0.5">Manage your personal information and security preferences</p>
          </div>
        </div>

        {/* Message Banner */}
        {message.text && (
          <div className={`p-4 rounded-sm text-xs font-bold mb-6 flex items-center gap-2.5 shadow-sm ${
            message.type === 'success' ? 'bg-[#d8bc98] text-[#2e1806] border border-[#baa080]' : 'bg-rose-100 text-rose-900 border border-rose-300'
          }`}>
            {message.type === 'success' ? <FaCheckCircle className="text-sm text-[#4a2c11]" /> : <FaExclamationCircle className="text-sm text-rose-700" />}
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-[#4a2c11] uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8c7158]">
                  <FaUser className="text-xs" />
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-sm border border-[#c4a98a] text-xs focus:outline-none focus:border-[#4a2c11] transition-all bg-[#f0e2d1] text-[#2e1806] placeholder-[#8c7158]"
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-xs font-bold text-[#4a2c11] uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8c7158]">
                  <FaEnvelope className="text-xs" />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 rounded-sm border border-[#c4a98a] text-xs bg-[#d8bc98]/50 text-[#613e1c] cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-[#4a2c11] uppercase tracking-wider mb-2">Phone Number</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8c7158]">
                <FaPhone className="text-xs" />
              </span>
              <input
                type="tel"
                name="phone"
                id="user_phone_number"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 9876543210"
                autoComplete="tel"
                className="w-full pl-10 pr-4 py-3 rounded-sm border border-[#c4a98a] text-xs focus:outline-none focus:border-[#4a2c11] transition-all bg-[#f0e2d1] text-[#2e1806] placeholder-[#8c7158]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#c4a98a]">
            <h3 className="text-sm font-serif font-bold text-[#2e1806] mb-1">Change Password</h3>
            <p className="text-[11px] text-[#613e1c] mb-4">Leave blank if you do not want to change your password.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-[#4a2c11] uppercase tracking-wider mb-2">Current Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8c7158]">
                    <FaLock className="text-xs" />
                  </span>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                    className="w-full pl-10 pr-4 py-3 rounded-sm border border-[#c4a98a] text-xs focus:outline-none focus:border-[#4a2c11] transition-all bg-[#f0e2d1] text-[#2e1806] placeholder-[#8c7158]"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-[#4a2c11] uppercase tracking-wider mb-2">New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8c7158]">
                    <FaLock className="text-xs" />
                  </span>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-4 py-3 rounded-sm border border-[#c4a98a] text-xs focus:outline-none focus:border-[#4a2c11] transition-all bg-[#f0e2d1] text-[#2e1806] placeholder-[#8c7158]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#4a2c11] hover:bg-[#2b1706] disabled:bg-[#4a2c11]/60 text-[#f7ebd9] font-medium rounded-sm shadow-md transition-all text-xs uppercase tracking-wider cursor-pointer"
          >
            {loading ? 'Saving Changes...' : 'Update Profile'}
          </button>

        </form>

      </div>
    </div>
  );
};

export default Profile;