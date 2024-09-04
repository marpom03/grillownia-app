import React, { createContext, useState, useEffect } from 'react';
import axios from './axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('/token?token=' + token);
        setUser(response.data.username);
        setLoading(false)
        return true;
      } catch (error) {
        console.error('Token verification failed', error);
        localStorage.removeItem('token');
        setUser(null);
        setLoading(false)
        return false;
      }
    }
    setLoading(false)
    return false;
  };

  const login = async (username, password) => {
    const response = await axios.post('/users/login', { username, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    setUser({ username });
  };

  const register = async (username, password) => {
    const response = await axios.post('/users/register', { username, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    setUser({ username });
  };

  const logout = async () => {
    await axios.post('/users/logout');
    localStorage.removeItem('token');
    setUser(null);
  };

  const refreshToken = async () => {
    const prevToken = localStorage.getItem('token');
    const response = await axios.get('/token', {
      params: { token: prevToken },
    });
    const { token } = response.data;
    localStorage.setItem('token', token);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken();
    }, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, setLoading, verifyToken }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
