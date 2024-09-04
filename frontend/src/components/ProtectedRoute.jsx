import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const ProtectedRoute = ({ component: Component }) => {
  const { user, verifyToken, loading, setLoading } = useAuth()

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
