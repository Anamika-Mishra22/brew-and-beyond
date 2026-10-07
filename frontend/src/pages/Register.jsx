import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  // 1. Inputs ke data ko store karne ke liye States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 2. AuthContext se register function aur routing ke liye navigate
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // 3. Form Submit Handler
  const handleRegister = async (e) => {
    e.preventDefault(); // Page reload hone se rokta hai
    setErrorMsg('');

    // Context wala register function call karke backend par data bheja
    const res = await register(name, email, password);

    if (res.success) {
      alert('Account Created Successfully! Please Login.');
      navigate('/login'); // Register hone ke baad Login page par bhej dega
    } else {
      setErrorMsg(res.message); // Agar email pehle se exist karta hai to error dikhayega
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#cca880] text-[#3a200a] font-sans px-6 py-10 selection:bg-[#4a2c11] selection:text-white">
      <form onSubmit={handleRegister} className="bg-[#e4cfb6] p-8 rounded-sm shadow-sm border border-[#c4a98a] w-full max-w-md space-y-5">
        <h2 className="text-2xl font-serif font-bold text-[#2e1806] text-center mb-2">Create Account </h2>
         
        {/* Error aane par Red Alert Box */}
        {errorMsg && <p className="bg-rose-950/20 border border-rose-950/40 text-rose-950 p-2.5 rounded-sm text-xs font-medium">{errorMsg}</p>}

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-[#52371e] mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 bg-white border border-[#c4a98a] rounded-sm text-sm text-[#2e1806] focus:outline-none focus:border-[#4a2c11]"
            required
          />
        </div>
           
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-[#52371e] mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2.5 bg-white border border-[#c4a98a] rounded-sm text-sm text-[#2e1806] focus:outline-none focus:border-[#4a2c11]"
            required
          />
        </div>
               
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-[#52371e] mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2.5 bg-white border border-[#c4a98a] rounded-sm text-sm text-[#2e1806] focus:outline-none focus:border-[#4a2c11]"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] font-medium py-3 rounded-sm text-xs tracking-wider uppercase transition shadow-sm cursor-pointer"
        >
          Register
        </button>

        <p className="text-xs text-[#52371e] text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-[#2e1806] font-bold hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;