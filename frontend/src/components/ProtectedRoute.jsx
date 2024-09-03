import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const ProtectedRoute = ({ component: Component }) => {
  const { user } = useAuth()

  return user ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
