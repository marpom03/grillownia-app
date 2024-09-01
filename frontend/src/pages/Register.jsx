import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login, logout, isAuthenticated } = useAuth();

  const handleRegister = () => {
    if (isAuthenticated) {
      logout()
    } else {
      login();
    }
    navigate('/home');
  };

  return (
    <div>
      <form onSubmit={handleRegister}>
        <input type="text" name="username" />
        <input type="password" name="password" />
        <input type="password" name="password-repeat" />
        <button type='submit'>Log in</button>
      </form>
    </div>
  );
};
