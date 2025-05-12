import React, { useState, useEffect } from 'react';
import './Validar2FA.css';
import usuarioService from '../api/usuarioService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

const Validar2FA: React.FC = () => {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth(); // Accedemos al contexto de autenticación

  // Efecto para redirigir al dashboard si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      console.log("Usuario ya autenticado, redirigiendo al dashboard");
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Eliminar espacios y validar que solo contiene dígitos
    const codigoLimpio = codigo.trim();

    if (codigoLimpio.length !== 6) {
      setError('El código debe tener exactamente 6 dígitos.');
      setLoading(false);
      return;
    }

    if (!/^\d+$/.test(codigoLimpio)) {
      setError('El código debe contener solo dígitos.');
      setLoading(false);
      return;
    }

    try {
      console.log("Enviando código 2FA para validación:", codigoLimpio);

      // Verificar que tengamos un token temporal
      const tempToken = localStorage.getItem('temp_token');
      if (!tempToken) {
        console.warn("No se encontró token temporal para validación 2FA");
      }

      const response = await usuarioService.validar2FA(codigoLimpio);

      console.log("Respuesta de validación 2FA:", response);

      if (response && response.token) {
        // Guardar token JWT en localStorage
        localStorage.setItem('token', response.token);

        // Eliminar token temporal que ya no necesitamos
        localStorage.removeItem('temp_token');

        console.log("Token 2FA guardado, redirigiendo...");

        // Mostrar mensaje de éxito y forzar recarga de la página
        setSuccess(true);

        // Forzar una recarga completa de la aplicación para reinicializar el estado de autenticación
        setTimeout(() => {
          window.location.href = '/dashboard'; // Usar location.href fuerza recarga completa
        }, 1000);
      } else {
        throw new Error("Respuesta inválida del servidor");
      }
    } catch (error: any) {
      console.error("Error en validación 2FA:", error);
      setError(error.response?.data?.error || error.response?.data?.mensaje || 'Código incorrecto. Verifique y vuelva a intentar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src="/logo-cufre-2.png" alt="CUFRE Logo" style={{ display: 'block', margin: '0 auto 16px auto', height: 64 }} />
        <h2>Verificación 2FA</h2>
        <p>Ingresa el código de 6 dígitos generado por Google Authenticator para continuar.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ display: 'block', textAlign: 'center', width: '100%' }}><strong>Código 2FA</strong></label>
            <input type="text" value={codigo} onChange={e => setCodigo(e.target.value)} maxLength={6} required />
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">Código verificado. Acceso concedido.</div>}
          <button type="submit" className="btn-primary" disabled={success || loading}>
            {loading ? 'Validando...' : 'Validar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Validar2FA; 