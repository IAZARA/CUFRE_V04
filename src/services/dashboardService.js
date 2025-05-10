import axios from 'axios';
import API_BASE_URL from '../utils/api';

// Obtener datos para el dashboard
export const getDashboardData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/estadisticas/dashboard`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener datos del dashboard:", error);
    throw error;
  }
}; 