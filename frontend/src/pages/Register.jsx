import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await fetch('https://brew-and-beyond.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Account Created Successfully! Please Login.');
        navigate('/login');
      } else {
        setErrorMsg(data.message || 'Registration failed. Please check inputs.');
      }
    } catch (err) {
      console.error('Registration Error:', err);
      setErrorMsg('Server se connect nahi ho pa raha hai (Backend Off ho sakta hai)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a120b] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-serif tracking-wider text-[#d4af37]">BREW & BEYOND</h2>
        <p className="mt-2 text-sm text-[#c8b6a6]">Join our exclusive coffee circle</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#261c14] py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-[#d4af37]/20">
          
          <h3 className="text-xl font-serif text-center text-[#f3e9dc] mb-6">Create Account</h3>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg text-sm text-center bg-rose-950/60 text-rose-300 border border-rose-500/35">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#c8b6a6] mb-2 font-medium">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a120b] border border-[#3e2723] rounded-lg text-[#f3e9dc] focus:outline-none focus:border-[#d4af37] transition duration-200 text-sm"
                placeholder="Anamika Mishra"
                required
              />
            </div>
              
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#c8b6a6] mb-2 font-medium">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a120b] border border-[#3e2723] rounded-lg text-[#f3e9dc] focus:outline-none focus:border-[#d4af37] transition duration-200 text-sm"
                placeholder="name@example.com"
                required
              />
            </div>
              
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#c8b6a6] mb-2 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a120b] border border-[#3e2723] rounded-lg text-[#f3e9dc] focus:outline-none focus:border-[#d4af37] transition duration-200 text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-[#1a120b] bg-[#d4af37] hover:bg-[#e6c55c] focus:outline-none transition duration-200 font-serif tracking-wider cursor-pointer"
              >
                {loading ? 'Creating Account...' : 'REGISTER'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#c8b6a6]">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[#d4af37] hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;