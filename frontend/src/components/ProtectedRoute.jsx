import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth(); // 🟢 Yahan loading bhi nikalna zaroori hai

  // 🟢 Jab tak AuthContext localStorage se token check kar raha hai, tab tak wait karein
  if (loading) {
    return (
      <div className="min-h-screen bg-[#cca880] flex items-center justify-center font-serif text-[#2e1806]">
        Brewing your session... ☕
      </div>
    );
  }

  // 🟢 Jab loading khatam ho jaye, tab check karein ki token hai ya nahi
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;