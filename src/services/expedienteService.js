import axios from 'axios';
import API_BASE_URL from '../utils/api';

// Obtener todos los expedientes
export const getAllExpedientes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/expedientes`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener todos los expedientes:", error);
    throw error;
  }
};

// Obtener un expediente por ID
export const getExpedienteById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/expedientes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener expediente con ID ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo expediente
export const createExpediente = async (expedienteData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/expedientes`, expedienteData);
    return response.data;
  } catch (error) {
    console.error("Error al crear expediente:", error);
    throw error;
  }
};

// Actualizar un expediente existente
export const updateExpediente = async (id, expedienteData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/expedientes/${id}`, expedienteData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar expediente con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar un expediente
export const deleteExpediente = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/expedientes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar expediente con ID ${id}:`, error);
    throw error;
  }
}; 