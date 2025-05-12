import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';
import { Rol } from '../types/usuario.types';

interface ProtectedRouteProps {
  requiredRoles?: Rol[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // O un spinner

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user.rol)) {
    return <Navigate to="/acceso-denegado" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute; 