import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import setupAxiosInterceptors from './utils/axiosConfig';

// Configurar interceptores de Axios
setupAxiosInterceptors();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 