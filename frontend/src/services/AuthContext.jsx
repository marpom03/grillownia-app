import React, { createContext, useState, useEffect } from 'react';
import axios from './axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log("Verifying the token")
      axios.get('/token')
        .then(response => {
          localStorage.setItem('token', response.data.token);
          setUser(response.data.user);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    // console.log(username)
    const response = await axios.post('/users/login', { username, password });
    // console.log(password)
    const { token } = response.data;
    // console.log(username, password, token)
    localStorage.setItem('token', token);
    // axios.defaults.headers.common['authorization'] = `${token.token}`;
    setUser({ username });
  };

  const register = async (username, password) => {
    // console.log(username)
    const response = await axios.post('/users/register', { username, password });
    // console.log(password)
    const { token } = response.data;
    // console.log(username, password, token)
    localStorage.setItem('token', token);
    // axios.defaults.headers.common['authorization'] = `${token.token}`;
    setUser({ username });
  };

  const logout = async () => {
    await axios.post('/users/logout'); // Optionally handle logout on backend
    localStorage.removeItem('token');
    setUser(null);
  };

  const refreshToken = async () => {
    const prevToken = localStorage.getItem('token');
    const response = await axios.get('/token', {
      params: { token: prevToken },
    });
    const { token } = response.data;
    console.log(prevToken, "NEW TOKEN: ", token)
    localStorage.setItem('token', token);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken(); // Refresh token at intervals, e.g., every 15 minutes
    }, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
