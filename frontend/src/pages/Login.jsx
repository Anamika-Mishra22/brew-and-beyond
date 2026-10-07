import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      setMessage({ text: 'Login Successful! Redirecting...', type: 'success' });
      localStorage.setItem('token', response.data.token);
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Invalid email or password!', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a120b] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-serif tracking-wider text-[#d4af37]">BREW & BEYOND</h2>
        <p className="mt-2 text-sm text-[#c8b6a6]">Experience the luxury of fine coffee</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#261c14] py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-[#d4af37]/20">
          
          <h3 className="text-xl font-serif text-center text-[#f3e9dc] mb-6">Welcome Back</h3>

          {message.text && (
            <div className={`mb-4 p-3 rounded-lg text-sm text-center ${
              message.type === 'success' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' : 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
            }`}>
              {message.text}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#c8b6a6] mb-2 font-medium">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a120b] border border-[#3e2723] rounded-lg text-[#f3e9dc] focus:outline-none focus:border-[#d4af37] transition duration-200 text-sm"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#c8b6a6] mb-2 font-medium">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a120b] border border-[#3e2723] rounded-lg text-[#f3e9dc] focus:outline-none focus:border-[#d4af37] transition duration-200 text-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-[#1a120b] bg-[#d4af37] hover:bg-[#e6c55c] focus:outline-none transition duration-200 font-serif tracking-wider"
              >
                {loading ? 'Logging in...' : 'SIGN IN'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#c8b6a6]">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-[#d4af37] hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}