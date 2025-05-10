import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';
import { Rol } from '../types/usuario.types';

interface ProtectedRouteProps {
  requiredRoles?: Rol[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Mostrar spinner mientras verifica autenticación
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Si requiere roles específicos y el usuario no tiene ninguno de esos roles
  if (requiredRoles && requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.rol);
    if (!hasRequiredRole) {
      return <Navigate to="/acceso-denegado" replace />;
    }
  }
  
  // Si pasa todas las validaciones, muestra el contenido de la ruta
  return <Outlet />;
};

export default ProtectedRoute; 