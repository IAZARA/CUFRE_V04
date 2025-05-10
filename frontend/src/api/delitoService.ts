import axios from 'axios';
import { Delito } from '../types/delito.types';
import { ExpedienteDelito } from '../types/expediente.types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const delitoService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/delitos`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener delitos:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener delitos');
    }
  },
  
  getById: async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/delitos/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error al obtener delito ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al obtener el delito');
    }
  },
  
  create: async (delito: Delito) => {
    try {
      const response = await axios.post(`${API_URL}/delitos`, delito);
      return response.data;
    } catch (error: any) {
      console.error('Error al crear delito:', error);
      throw new Error(error.response?.data?.message || 'Error al crear el delito');
    }
  },
  
  update: async (id: number, delito: Delito) => {
    try {
      const response = await axios.put(`${API_URL}/delitos/${id}`, delito);
      return response.data;
    } catch (error: any) {
      console.error(`Error al actualizar delito ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al actualizar el delito');
    }
  },
  
  delete: async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/delitos/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error al eliminar delito ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al eliminar el delito');
    }
  },
  
  searchDelitos: async (query: string) => {
    try {
      const response = await axios.get(`${API_URL}/delitos/buscar`, { params: { q: query } });
      return response.data;
    } catch (error: any) {
      console.error('Error al buscar delitos:', error);
      throw new Error(error.response?.data?.message || 'Error al buscar delitos');
    }
  },
  
  getByLey: async (ley: string) => {
    try {
      const response = await axios.get(`${API_URL}/delitos/ley/${ley}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error al obtener delitos por ley ${ley}:`, error);
      throw new Error(error.response?.data?.message || 'Error al obtener delitos por ley');
    }
  },
  
  getDelitosPorExpediente: async (expedienteId: number) => {
    try {
      const response = await axios.get(`${API_URL}/expedientes/${expedienteId}/delitos`);
      return response.data;
    } catch (error: any) {
      console.error(`Error al obtener delitos del expediente ${expedienteId}:`, error);
      throw new Error(error.response?.data?.message || 'Error al obtener delitos del expediente');
    }
  },
  
  asociarDelitoExpediente: async (expedienteDelito: ExpedienteDelito) => {
    try {
      const response = await axios.post(
        `${API_URL}/expedientes/${expedienteDelito.expedienteId}/delitos`, 
        expedienteDelito
      );
      return response.data;
    } catch (error: any) {
      console.error('Error al asociar delito a expediente:', error);
      throw new Error(error.response?.data?.message || 'Error al asociar delito');
    }
  },
  
  desasociarDelitoExpediente: async (expedienteDelitoId: number) => {
    try {
      const response = await axios.delete(`${API_URL}/expediente-delitos/${expedienteDelitoId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error al desasociar delito ${expedienteDelitoId}:`, error);
      throw new Error(error.response?.data?.message || 'Error al desasociar delito');
    }
  }
};

export default delitoService; 