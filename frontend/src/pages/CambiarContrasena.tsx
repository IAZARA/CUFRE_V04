import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CambiarContrasena.css';
import usuarioService from '../api/usuarioService';

const CambiarContrasena: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    try {
      await usuarioService.cambiarContrasena(password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError('Error al cambiar la contraseña');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Cambiar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nueva contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Confirmar contraseña</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">Contraseña cambiada con éxito. Redirigiendo...</div>}
          <button type="submit" className="btn-primary" disabled={success}>Cambiar</button>
        </form>
      </div>
    </div>
  );
};

export default CambiarContrasena; 