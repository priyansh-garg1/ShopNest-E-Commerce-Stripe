import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api/users';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userInfo, setUserInfo] = useState(() => {
    try {
      const storedUserInfo = localStorage.getItem('userInfo');
      return storedUserInfo ? JSON.parse(storedUserInfo) : null;
    } catch (error) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [userInfo]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });
      setUserInfo(data);
      toast.success('Logged in successfully!');
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      toast.error(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(API_URL, { name, email, password }, { withCredentials: true });
      setUserInfo(data);
      toast.success('Registration successful!');
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      toast.error(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    setUserInfo(null);
    toast.success('You have been logged out.');
  };

  const value = { userInfo, loading, error, login, register, logout, clearError: () => setError(null) };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);