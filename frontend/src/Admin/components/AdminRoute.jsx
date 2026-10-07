import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Local storage se Direct Fallback Check
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const currentUser = user || storedUser;

  if (loading && !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <p className="text-amber-900 font-bold text-lg animate-pulse">
          Checking Admin Access... ☕
        </p>
      </div>
    );
  }

  // Safe Role Check
  const isAdmin = currentUser && currentUser.role && currentUser.role.trim().toLowerCase() === 'admin';

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;