import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { Rol } from '../types/usuario.types';
import { useOutletContext } from 'react-router-dom';

// Importar componentes de Layout
import MainLayout from '../components/layout/MainLayout';

// Importar páginas
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import AccesoDenegado from '../pages/AccesoDenegado';
import NotFound from '../pages/NotFound';
import CambiarContrasena from '../pages/CambiarContrasena';
import Activar2FA from '../pages/Activar2FA';
import Validar2FA from '../pages/Validar2FA';

// Páginas de Expedientes
import ExpedientesPage from '../pages/expedientes/ExpedientesPage';
import ExpedienteFormPage from '../pages/expedientes/ExpedienteFormPage';
import ExpedienteDetallePage from '../pages/expedientes/ExpedienteDetallePage';

// Páginas de Delitos
import DelitosPage from '../pages/delitos/DelitosPage';
import DelitoFormPage from '../pages/delitos/DelitoFormPage';

// Páginas de Estadísticas
import EstadisticasPage from '../pages/estadisticas/EstadisticasPage';
import MapaGeneralPage from '../pages/estadisticas/MapaGeneralPage';

// Páginas de Usuarios
import UsuariosPage from '../pages/usuarios/UsuariosPage';
import UsuarioFormPage from '../pages/usuarios/UsuarioFormPage';

// Nueva página MasBuscadosPage
import MasBuscadosPage from '../pages/MasBuscadosPage';

// Wrapper para MainLayout que oculta el footer si el modal de Más Buscados está abierto
type MasBuscadosContext = { modalOpen?: boolean };
function MainLayoutWithFooterControl() {
  const context = useOutletContext<MasBuscadosContext>();
  return <MainLayout />;
}

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/cambiar-contrasena" element={<CambiarContrasena />} />
      <Route path="/activar-2fa" element={<Activar2FA />} />
      <Route path="/validar-2fa" element={<Validar2FA />} />
      <Route path="/acceso-denegado" element={<AccesoDenegado />} />
      
      {/* Redirección a dashboard cuando se accede a la raíz */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Rutas protegidas - requieren autenticación */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayoutWithFooterControl />}>
          <Route path="/mas-buscados" element={<MasBuscadosPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Rutas de Expedientes */}
          <Route path="/expedientes" element={<ExpedientesPage />} />
          <Route path="/expedientes/crear" element={<ExpedienteFormPage />} />
          <Route path="/expedientes/editar/:id" element={<ExpedienteFormPage />} />
          <Route path="/expedientes/detalle/:id" element={<ExpedienteDetallePage />} />
          
          {/* Rutas de Delitos */}
          <Route path="/delitos" element={<DelitosPage />} />
          <Route path="/delitos/crear" element={<DelitoFormPage />} />
          <Route path="/delitos/editar/:id" element={<DelitoFormPage />} />
          
          {/* Rutas de Estadísticas */}
          <Route path="/estadisticas" element={<EstadisticasPage />} />
          <Route path="/estadisticas/mapa" element={<MapaGeneralPage />} />
          
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