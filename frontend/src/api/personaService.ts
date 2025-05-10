import axios from 'axios';
import { Persona, Domicilio, MedioComunicacion } from '../types/persona.types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const personaService = {
  // Operaciones CRUD básicas para personas
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/personas`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener personas:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener personas');
    }
  },
  
  getById: async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/personas/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error al obtener persona ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al obtener la persona');
    }
  },
  
  create: async (persona: Persona) => {
    try {
      const response = await axios.post(`${API_URL}/personas`, persona);
      return response.data;
    } catch (error: any) {
      console.error('Error al crear persona:', error);
      throw new Error(error.response?.data?.message || 'Error al crear la persona');
    }
  },
  
  update: async (id: number, persona: Persona) => {
    try {
      const response = await axios.put(`${API_URL}/personas/${id}`, persona);
      return response.data;
    } catch (error: any) {
      console.error(`Error al actualizar persona ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al actualizar la persona');
    }
  },
  
  delete: async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/personas/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error al eliminar persona ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al eliminar la persona');
    }
  },
  
  // Búsquedas específicas
  searchPersonas: async (query: string) => {
    try {
      const response = await axios.get(`${API_URL}/personas/buscar`, { params: { q: query } });
      return response.data;
    } catch (error: any) {
      console.error('Error al buscar personas:', error);
      throw new Error(error.response?.data?.message || 'Error al buscar personas');
    }
  },
  
  getByDocumento: async (documento: string) => {
    try {
      const response = await axios.get(`${API_URL}/personas/documento/${documento}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error al buscar persona con documento ${documento}:`, error);
      throw new Error(error.response?.data?.message || 'Error al buscar por documento');
    }
  },
  
  // Operaciones para domicilios
  getDomicilios: async (personaId: number) => {
    const response = await axios.get(`${API_URL}/domicilios/persona/${personaId}`);
    return response.data;
  },
  
  createDomicilio: async (domicilio: Domicilio) => {
    const response = await axios.post('/domicilios', domicilio);
    return response.data;
  },
  
  updateDomicilio: async (id: number, domicilio: Domicilio) => {
    const response = await axios.put(`/domicilios/${id}`, domicilio);
    return response.data;
  },
  
  deleteDomicilio: async (id: number) => {
    await axios.delete(`/domicilios/${id}`);
  },
  
  // Operaciones para medios de comunicación
  getMediosComunicacion: async (personaId: number) => {
    const response = await axios.get(`${API_URL}/personas/${personaId}/medios-comunicacion`);
    return response.data;
  },
  
  createMedioComunicacion: async (medioComunicacion: MedioComunicacion) => {
    const response = await axios.post('/medios-comunicacion', medioComunicacion);
    return response.data;
  },
  
  updateMedioComunicacion: async (id: number, medioComunicacion: MedioComunicacion) => {
    const response = await axios.put(`/medios-comunicacion/${id}`, medioComunicacion);
    return response.data;
  },
  
  deleteMedioComunicacion: async (id: number) => {
    await axios.delete(`/medios-comunicacion/${id}`);
  }
};

export default personaService; 