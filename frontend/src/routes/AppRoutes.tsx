import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { Rol } from '../types/usuario.types';

// Importar componentes de Layout
import MainLayout from '../components/layout/MainLayout';

// Importar páginas
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import AccesoDenegado from '../pages/AccesoDenegado';
import NotFound from '../pages/NotFound';

// Páginas de Expedientes
import ExpedientesPage from '../pages/expedientes/ExpedientesPage';
import ExpedienteFormPage from '../pages/expedientes/ExpedienteFormPage';

// Páginas de Delitos
import DelitosPage from '../pages/delitos/DelitosPage';
import DelitoFormPage from '../pages/delitos/DelitoFormPage';

// Páginas de Estadísticas
import EstadisticasPage from '../pages/estadisticas/EstadisticasPage';

// Páginas de Usuarios
import UsuariosPage from '../pages/usuarios/UsuariosPage';
import UsuarioFormPage from '../pages/usuarios/UsuarioFormPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/acceso-denegado" element={<AccesoDenegado />} />
      
      {/* Redirección a dashboard cuando se accede a la raíz */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Rutas protegidas - requieren autenticación */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Rutas de Expedientes */}
          <Route path="/expedientes" element={<ExpedientesPage />} />
          <Route path="/expedientes/crear" element={<ExpedienteFormPage />} />
          <Route path="/expedientes/editar/:id" element={<ExpedienteFormPage />} />
          
          {/* Rutas de Delitos */}
          <Route path="/delitos" element={<DelitosPage />} />
          <Route path="/delitos/crear" element={<DelitoFormPage />} />
          <Route path="/delitos/editar/:id" element={<DelitoFormPage />} />
          
          {/* Rutas de Estadísticas */}
          <Route path="/estadisticas" element={<EstadisticasPage />} />
          
          {/* Rutas solo para administradores */}
          <Route element={<ProtectedRoute requiredRoles={[Rol.ADMINISTRADOR, Rol.SUPERUSUARIO]} />}>
            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/usuarios/crear" element={<UsuarioFormPage />} />
            <Route path="/usuarios/editar/:id" element={<UsuarioFormPage />} />
          </Route>
        </Route>
      </Route>
      
      {/* Fallback para rutas no encontradas */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 