import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(''); // Success message state
  
  const { loginWithData } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
      
    try {
      const response = await fetch('https://brew-and-beyond.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
            
      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        const userData = data.user || data.userData || { name: data.name, email: data.email, _id: data._id };

        // Local Storage aur Auth context update
        loginWithData(userData, token);

        // Success popup / message dikhane ke liye
        setSuccessMsg('Login Successful! Redirecting to Home...');

        // Thoda sa gap dekar home page par bhej denge taaki message dikh jaye
        setTimeout(() => {
          navigate('/');
        }, 1000);

      } else {
        setError(data.message || 'Invalid Credentials');
      }
    } catch (err) {
      console.error('Login Fetch Error:', err);
      setError('Server se connect nahi ho pa raha hai (Backend Off ho sakta hai)');
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
          
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm text-center bg-rose-950/60 text-rose-300 border border-rose-500/35">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg text-sm text-center bg-emerald-950/60 text-emerald-300 border border-emerald-500/35">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#c8b6a6] mb-2 font-medium">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full px-4 py-3 bg-[#1a120b] border border-[#3e2723] rounded-lg text-[#f3e9dc] focus:outline-none focus:border-[#d4af37] transition duration-200 text-sm" 
                placeholder="name@example.com"
              />
            </div>
              
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#c8b6a6] mb-2 font-medium">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full px-4 py-3 bg-[#1a120b] border border-[#3e2723] rounded-lg text-[#f3e9dc] focus:outline-none focus:border-[#d4af37] transition duration-200 text-sm" 
                placeholder="••••••••"
              />
            </div>
                
            <div>
              <button 
                type="submit" 
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-[#1a120b] bg-[#d4af37] hover:bg-[#e6c55c] focus:outline-none transition duration-200 font-serif tracking-wider cursor-pointer"
              >
                SIGN IN
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
};

export default Login;