import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSignOutAlt, FaReceipt, FaUserShield, FaCalendarAlt, FaChevronRight } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Mobile Menu
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false); // Side Account Drawer
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const { totalItems, clearCart } = useCart();
  const { user, token, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    clearCart();
    setIsOpen(false);
    setAccountDrawerOpen(false);
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-[#18110b]/95 backdrop-blur-md text-[#ece5db] border-b border-[#2d2117] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* 1. Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <span className="text-xl md:text-2xl font-serif font-bold text-[#f4efe8] tracking-[0.15em] hover:text-[#e2b887] transition-colors">
                BREW & BEYOND
              </span>
            </Link>

            {/* 2. Desktop Navigation Links (Centered) */}
            <div className="hidden md:flex items-center space-x-12 text-xs font-semibold tracking-[0.2em] uppercase text-[#a89b8d]">
              <Link 
                to="/" 
                className={`transition-all duration-300 relative py-2 ${isActive('/') ? 'text-[#e2b887] font-bold' : 'hover:text-[#f4efe8]'}`}
              >

                Home
                {isActive('/') && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#e2b887] rounded-full"></span>}
              </Link>
              <Link 
                to="/menu" 
                className={`transition-all duration-300 relative py-2 ${isActive('/menu') ? 'text-[#e2b887] font-bold' : 'hover:text-[#f4efe8]'}`}
              >
                Menu
                {isActive('/menu') && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#e2b887] rounded-full"></span>}
              </Link>
            </div>

            {/* 3. Right Actions */}
            <div className="flex items-center space-x-4">
              
              {/* Cart Icon Badge */}
              <Link to="/cart" className="relative p-2.5 text-[#ece5db] hover:text-[#e2b887] transition bg-[#23170f] rounded-full border border-[#36261a]" aria-label="Cart">
                <FaShoppingCart className="text-sm" />
                <span className="absolute -top-1 -right-1 bg-[#e2b887] text-[#18110b] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {totalItems || 0}
                </span>
              </Link>

              {/* Desktop Auth / Account Trigger */}
              {token && user ? (
                <button 
                  onClick={() => setAccountDrawerOpen(true)}
                  className="hidden sm:flex items-center gap-2.5 bg-[#23170f] hover:bg-[#2d2117] px-4 py-2 rounded-full border border-[#36261a] transition cursor-pointer group"
                >
                  <div className="w-5 h-5 rounded-full bg-[#e2b887] text-[#18110b] flex items-center justify-center text-[10px] font-bold">
                    <FaUser className="text-[10px]" />
                  </div>
                  <span className="text-xs font-medium text-[#c4b5a5] group-hover:text-[#f4efe8] max-w-[110px] truncate">
                    {user?.name || user?.email || 'Account'}
                  </span>
                </button>
              ) : (
                <Link 
                  to="/login" 
                  className="hidden sm:flex items-center gap-2 bg-[#e2b887] hover:bg-[#d4a876] text-[#18110b] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition shadow-sm"
                >
                  <FaUser /> Login
                </Link>
              )}

              {/* Mobile Toggle Button */}
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="md:hidden text-xl text-[#ece5db] focus:outline-none p-2 bg-[#23170f] rounded-md border border-[#36261a] cursor-pointer"
                aria-label="Toggle Menu"
              >
                {isOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isOpen && (
          <div className="md:hidden bg-[#1c130d] px-6 pt-5 pb-7 space-y-4 border-t border-[#36261a] shadow-xl animate-fadeIn">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                onClick={() => setIsOpen(false)}
                className={`py-2.5 px-4 rounded-md text-xs font-semibold uppercase tracking-wider transition ${isActive('/') ? 'bg-[#2d2117] text-[#e2b887]' : 'text-[#ece5db] hover:bg-[#23170f]'}`}
              >
                Home
              </Link>
              <Link 
                to="/menu" 
                onClick={() => setIsOpen(false)}
                className={`py-2.5 px-4 rounded-md text-xs font-semibold uppercase tracking-wider transition ${isActive('/menu') ? 'bg-[#2d2117] text-[#e2b887]' : 'text-[#ece5db] hover:bg-[#23170f]'}`}
              >
                Menu
              </Link>
            </div>

            {token && user ? (
              <div className="pt-4 border-t border-[#36261a] space-y-3">
                <div className="text-xs text-[#e2b887] font-medium flex items-center gap-2 px-2">
                  <FaUser /> Signed in as <span className="font-bold">{user?.name || user?.email || 'User'}</span>
                </div>

                {user.role === 'admin' && (
                  <Link 
                    to="/admin/dashboard" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between py-2.5 px-4 bg-[#e2b887] text-[#18110b] rounded-md text-xs font-bold uppercase tracking-wider shadow-sm"
                  >
                    <span className="flex items-center gap-2"><FaUserShield /> Admin Panel</span>
                    <FaChevronRight className="text-xs" />
                  </Link>
                )}

                <Link 
                  to="/profile" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between py-2.5 px-4 bg-[#23170f] text-[#ece5db] rounded-md text-xs font-semibold uppercase tracking-wider border border-[#36261a]"
                >
                  <span className="flex items-center gap-2"><FaUser className="text-[#e2b887]" /> Profile</span>
                  <FaChevronRight className="text-xs" />
                </Link>

                <Link 
                  to="/orders" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between py-2.5 px-4 bg-[#23170f] text-[#ece5db] rounded-md text-xs font-semibold uppercase tracking-wider border border-[#36261a]"
                >
                  <span className="flex items-center gap-2"><FaReceipt /> Order History</span>
                  <FaChevronRight className="text-xs" />
                </Link>

                <Link 
                  to="/myreservation" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between py-2.5 px-4 bg-[#23170f] text-[#ece5db] rounded-md text-xs font-semibold uppercase tracking-wider border border-[#36261a]"
                >
                  <span className="flex items-center gap-2"><FaCalendarAlt className="text-[#e2b887]" /> My Bookings</span>
                  <FaChevronRight className="text-xs" />
                </Link>

                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-950/40 text-rose-300 border border-rose-900/50 rounded-md text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="block bg-[#e2b887] text-[#18110b] text-center py-3 text-xs font-bold uppercase tracking-widest rounded-md shadow-sm"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </nav>

     {/* 4. SLIDE-OVER ACCOUNT DRAWER (Floating Content-Fitted Style) */}
      {accountDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setAccountDrawerOpen(false)}
          />

          {/* Floating Drawer Panel */}
          <div className="absolute top-4 right-4 flex pl-10">
            <div className="w-72 bg-[#18110b] border border-[#2d2117] text-[#ece5db] p-4 flex flex-col justify-between shadow-2xl rounded-lg">
              
              {/* Drawer Top Content */}
              <div>
                {/* Header Profile Info */}
                <div className="flex items-center justify-between pb-3 border-b border-[#2d2117]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#e2b887] text-[#18110b] flex items-center justify-center font-bold text-xs shadow-md">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-xs text-[#f4efe8]">
                        {user?.name || 'Coffee Enthusiast'}
                      </h3>
                      <p className="text-[9px] text-[#a89b8d] truncate max-w-[130px]">
                        {user?.email || 'user@brewandbeyond.com'}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setAccountDrawerOpen(false)}
                    className="p-1 text-[#a89b8d] hover:text-white bg-[#23170f] rounded-full border border-[#36261a] transition cursor-pointer"
                  >
                    <FaTimes className="text-[10px]" />
                  </button>
                </div>

                {/* Options List */}
                <div className="pt-3 space-y-1.5">
                  <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-[#a89b8d] mb-1">Manage Account</p>

                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin/dashboard" 
                      onClick={() => setAccountDrawerOpen(false)}
                      className="flex items-center justify-between p-2 bg-[#23170f] hover:bg-[#2d2117] rounded border border-[#36261a] transition group"
                    >
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#e2b887]">
                        <FaUserShield className="text-xs" /> Admin Panel
                      </div>
                      <FaChevronRight className="text-[8px] text-[#a89b8d] group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  )}

                  <Link 
                    to="/profile" 
                    onClick={() => setAccountDrawerOpen(false)}
                    className="flex items-center justify-between p-2 bg-[#23170f] hover:bg-[#2d2117] rounded border border-[#36261a] transition group"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#ece5db]">
                      <FaUser className="text-[11px] text-[#e2b887]" /> Profile
                    </div>
                    <FaChevronRight className="text-[8px] text-[#a89b8d] group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <Link 
                    to="/orders" 
                    onClick={() => setAccountDrawerOpen(false)}
                    className="flex items-center justify-between p-2 bg-[#23170f] hover:bg-[#2d2117] rounded border border-[#36261a] transition group"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#ece5db]">
                      <FaReceipt className="text-[11px] text-[#e2b887]" />  Order History
                    </div>
                    <FaChevronRight className="text-[8px] text-[#a89b8d] group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <Link 
                    to="/myreservation" 
                    onClick={() => setAccountDrawerOpen(false)}
                    className="flex items-center justify-between p-2 bg-[#23170f] hover:bg-[#2d2117] rounded border border-[#36261a] transition group"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#ece5db]">
                      <FaCalendarAlt className="text-[11px] text-[#e2b887]" />  My Bookings
                    </div>
                    <FaChevronRight className="text-[8px] text-[#a89b8d] group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Bottom Sign Out Button */}
              <div className="pt-3 mt-3 border-t border-[#2d2117]">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-900/50 rounded text-[10px] font-semibold uppercase tracking-wider transition cursor-pointer shadow-sm"
                >
                  <FaSignOutAlt className="text-[11px]" /> Sign Out
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;