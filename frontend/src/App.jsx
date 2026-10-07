import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Register from './pages/Register';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import AdminReservations from './Admin/pages/AdminReservations';
// 🟢 Admin Imports (Admin Route Security & New Layout/Pages)
import AdminRoute from './Admin/components/AdminRoute';
import AdminLayout from './Admin/layout/AdminLayout';
import Dashboard from './Admin/pages/Dashboard';
import LiveOrders from './Admin/pages/LiveOrders';
import MenuItems from './Admin/pages/MenuItems';
import Users from './Admin/pages/Users';
import Profile from './pages/Profile';
import MyReservations from './pages/MyReservations';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
      
            <Route
              path="/*"
              element={
                <div className="min-h-screen bg-amber-50/30">
                  <Navbar />
                  <main>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="home" element={<Home />} />
                      <Route path="menu" element={<Menu />} />
                      <Route path="cart" element={<Cart />} />
                      <Route path="register" element={<Register />} />
                      <Route path="login" element={<Login />} />
                            
                      {/* Customer Protected Routes */}
                      <Route
                        path="checkout"
                        element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="orders"
                        element={
                          <ProtectedRoute>
                            <Orders />
                          </ProtectedRoute>
                        }
                      />
                       <Route
                        path="myreservation"
                        element={
                          <ProtectedRoute>
                            <MyReservations/>
                          </ProtectedRoute>
                        }
                      
                      />

                      
                    </Routes>
                  </main>
                </div>
              }
            />
            <Route path="/profile" element={<Profile />} />
            {/* 🟢 ADMIN PANEL MODULE (Without Main Navbar) */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="/admin/orders" element={<LiveOrders />} />
              <Route path="/admin/menu" element={<MenuItems />} />
              <Route path="/admin/Users" element={<Users/>} />
              <Route path="/admin/reservations" element={<AdminReservations />} />
              
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;