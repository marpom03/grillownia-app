import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const ProtectedRoute = ({ component: Component }) => {
  const { user, verifyToken, loading, setLoading } = useAuth()
  // useEffect(() => {
  //   const checkToken = async () => {
  //     console.log("Before")
  //     const out = await verifyToken(); 
  //     console.log(out, user)
  //     setLoading(false)
  //   };

  //   checkToken();
  // }, [verifyToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
