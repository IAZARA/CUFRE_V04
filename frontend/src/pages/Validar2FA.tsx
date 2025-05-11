import React, { useState } from 'react';
import './Validar2FA.css';
import usuarioService from '../api/usuarioService';
import { useNavigate } from 'react-router-dom';

const Validar2FA: React.FC = () => {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (codigo.length !== 6) {
      setError('El código debe tener 6 dígitos.');
      return;
    }
    try {
      const response = await usuarioService.validar2FA(codigo);
      localStorage.setItem('token', response.token);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch {
      setError('Código incorrecto');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Verificación 2FA</h2>
        <p>Ingresa el código de 6 dígitos generado por Google Authenticator para continuar.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Código 2FA</label>
            <input type="text" value={codigo} onChange={e => setCodigo(e.target.value)} maxLength={6} required />
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">Código verificado. Acceso concedido.</div>}
          <button type="submit" className="btn-primary" disabled={success}>Validar</button>
        </form>
      </div>
    </div>
  );
};

export default Validar2FA; 