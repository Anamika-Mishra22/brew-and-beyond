import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { loginWithData } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
      
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
           
      const data = await response.json();

      if (response.ok) {
        // Backend Response structure check & fallback mapping
        const token = data.token;
        const userData = data.user || data.userData || { name: data.name, email: data.email, _id: data._id };

        // Local Storage aur React State dono instant update honge
        loginWithData(userData, token);
        
        navigate('/');
      } else {
        setError(data.message || 'Invalid Credentials');
      }
    } catch (err) {
      console.error('Login Fetch Error:', err);
      setError('Server se connect nahi ho pa raha hai (Backend Off ho sakta hai)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#cca880] text-[#3a200a] font-sans px-4 py-10 selection:bg-[#4a2c11] selection:text-white">
      <div className="bg-[#e4cfb6] p-8 rounded-sm shadow-sm border border-[#c4a98a] w-full max-w-md">
        <h2 className="text-3xl font-serif font-bold text-center text-[#2e1806] mb-6">Welcome Back </h2>
        
        {error && <div className="bg-rose-950/20 border border-rose-950/40 text-rose-950 p-3 rounded-sm text-xs font-medium mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#52371e] mb-1 font-medium">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full p-2.5 bg-white border border-[#c4a98a] rounded-sm text-sm text-[#2e1806] focus:outline-none focus:border-[#4a2c11]" 
              placeholder="user@example.com"
            />
          </div>
            
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#52371e] mb-1 font-medium">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full p-2.5 bg-white border border-[#c4a98a] rounded-sm text-sm text-[#2e1806] focus:outline-none focus:border-[#4a2c11]" 
              placeholder="••••••••"
            />
          </div>
                
          <button 
            type="submit" 
            className="w-full bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] py-3 rounded-sm font-medium text-xs tracking-wider uppercase transition shadow-sm cursor-pointer"
          >
            Login
          </button>
        </form>

        <p className="text-center text-xs text-[#52371e] mt-4">
          Don't have an account? <Link to="/register" className="text-[#2e1806] font-bold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;