import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios'; // 👈 1. Axios import karein

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken && storedUser !== "undefined") {
      let parsedUser = JSON.parse(storedUser);

      if (!parsedUser.role && storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          parsedUser.role = decoded.role || 'user';
        } catch (err) {
          console.error("Token decode error", err);
        }
      }
        
      setUser(parsedUser);
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // 🟢 2. NEW REGISTER FUNCTION ADD KAREIN
  const register = async (name, email, password) => {
    try {
      const response = await axios.post('https://brew-and-beyond.onrender.com/api/auth/register', {
        name,
        email,
        password,
      });

      // Backend response return karega (e.g. { success: true, message: "Registered" })
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Try again!',
      };
    }
  };

  const loginWithData = (userData, userToken) => {
    let finalUser = { ...userData };
    if (!finalUser.role && userToken) {
      try {
        const decoded = jwtDecode(userToken);
        finalUser.role = decoded.role || 'user';
      } catch (err) {}
    }
          
    localStorage.setItem('user', JSON.stringify(finalUser));
    localStorage.setItem('token', userToken);

    setUser(finalUser);
    setToken(userToken);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken('');
  };

  return (
    // 🟢 3. VALUE PROPS ME `register` INCLUDE KARDEN
    <AuthContext.Provider value={{ user, token, register, loginWithData, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};