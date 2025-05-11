import React, { useState, useEffect } from 'react';
import './Activar2FA.css';
import usuarioService from '../api/usuarioService';
import { useNavigate } from 'react-router-dom';

const Activar2FA: React.FC = () => {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    usuarioService.obtenerQr2FA().then(setQrUrl);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (codigo.length !== 6) {
      setError('El código debe tener 6 dígitos.');
      return;
    }
    try {
      await usuarioService.activar2FA(codigo);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setError('Código incorrecto');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Activar Segundo Factor (2FA)</h2>
        <p>Por seguridad, debes activar el segundo factor de autenticación usando Google Authenticator.</p>
        <div className="qr-section">
          {/* Aquí se mostraría el QR real */}
          {qrUrl ? (
            <img src={qrUrl} alt="QR 2FA" className="qr-placeholder" />
          ) : (
            <div className="qr-placeholder">QR</div>
          )}
          <p>Escanea este código QR con Google Authenticator y luego ingresa el primer código generado.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Código de 6 dígitos</label>
            <input type="text" value={codigo} onChange={e => setCodigo(e.target.value)} maxLength={6} required />
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">2FA activado con éxito.</div>}
          <button type="submit" className="btn-primary" disabled={success}>Activar</button>
        </form>
      </div>
    </div>
  );
};

export default Activar2FA; 