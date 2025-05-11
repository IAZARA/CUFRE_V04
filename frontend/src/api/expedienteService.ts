import axios from './axios';
import { Expediente, Vinculo, ExpedienteDelito } from '../types/expediente.types';

const expedienteService = {
  // Obtener todos los expedientes
  getExpedientes: async (page = 0, size = 10, search = '', filters = {}): Promise<any> => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(search && { search })
      });
      
      // Agregar filtros si existen
      if (Object.keys(filters).length > 0) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      const response = await axios.get(`/expedientes?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener expedientes:', error);
      throw error;
    }
  },

  // Alias para getExpedientes sin paginación - para compatibilidad
  getAll: async (): Promise<Expediente[]> => {
    try {
      const response = await axios.get(`/expedientes`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener todos los expedientes:', error);
      throw error;
    }
  },

  // Obtener un expediente por ID
  getExpedienteById: async (id: number): Promise<Expediente> => {
    try {
      const response = await axios.get(`/expedientes/${id}`);
      
      // Asegurarse de que las arrays existan aunque vengan vacías del servidor
      const expediente = {
        ...response.data,
        fotografias: response.data.fotografias || [],
        documentos: response.data.documentos || [],
        personas: response.data.personas || [],
        delitos: response.data.delitos || []
      };
      
      return expediente;
    } catch (error) {
      console.error(`Error al obtener expediente con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo expediente
  createExpediente: async (expediente: Expediente): Promise<Expediente> => {
    try {
      const response = await axios.post(`/expedientes`, expediente);
      return response.data;
    } catch (error) {
      console.error('Error al crear expediente:', error);
      throw error;
    }
  },

  // Alias para createExpediente - para compatibilidad
  create: async (expediente: Expediente): Promise<Expediente> => {
    return expedienteService.createExpediente(expediente);
  },

  // Actualizar un expediente existente
  updateExpediente: async (id: number, expediente: Expediente): Promise<Expediente> => {
    try {
      const response = await axios.put(`/expedientes/${id}`, expediente);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar expediente con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un expediente
  deleteExpediente: async (id: number): Promise<void> => {
    try {
      await axios.delete(`/expedientes/${id}`);
    } catch (error) {
      console.error(`Error al eliminar expediente con ID ${id}:`, error);
      throw error;
    }
  },

  // Alias para deleteExpediente - para compatibilidad
  delete: async (id: number): Promise<void> => {
    return expedienteService.deleteExpediente(id);
  },

  // Gestión de fotografías
  getFotografias: async (expedienteId: number): Promise<any[]> => {
    try {
      const response = await axios.get(`/expedientes/${expedienteId}/fotografias`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener fotografías del expediente ${expedienteId}:`, error);
      throw error;
    }
  },

  uploadFotografia: async (expedienteId: number, formData: FormData): Promise<any> => {
    try {
      const response = await axios.post(
        `/archivos/fotografias/${expedienteId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error al subir fotografía al expediente ${expedienteId}:`, error);
      throw error;
    }
  },

  deleteFotografia: async (expedienteId: number, fotografiaId: number): Promise<void> => {
    try {
      await axios.delete(`/expedientes/${expedienteId}/fotografias/${fotografiaId}`);
    } catch (error) {
      console.error(`Error al eliminar fotografía con ID ${fotografiaId}:`, error);
      throw error;
    }
  },

  // Gestión de documentos
  getDocumentos: async (expedienteId: number): Promise<any[]> => {
    try {
      const response = await axios.get(`/expedientes/${expedienteId}/documentos`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener documentos del expediente ${expedienteId}:`, error);
      throw error;
    }
  },

  uploadDocumento: async (expedienteId: number, formData: FormData): Promise<any> => {
    try {
      const response = await axios.post(
        `/archivos/documentos/${expedienteId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error al subir documento al expediente ${expedienteId}:`, error);
      throw error;
    }
  },

  deleteDocumento: async (id: number): Promise<void> => {
    try {
      await axios.delete(`/documentos/${id}`);
    } catch (error) {
      console.error(`Error al eliminar documento con ID ${id}:`, error);
      throw error;
    }
  },

  // Gestión de personas relacionadas
  getPersonas: async (expedienteId: number): Promise<any[]> => {
    try {
      const response = await axios.get(`/expedientes/${expedienteId}/personas`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener personas del expediente ${expedienteId}:`, error);
      throw error;
    }
  },

  addPersona: async (expedienteId: number, persona: any): Promise<any> => {
    try {
      const response = await axios.post(`/expedientes/${expedienteId}/personas`, persona);
      return response.data;
    } catch (error) {
      console.error(`Error al agregar persona al expediente ${expedienteId}:`, error);
      throw error;
    }
  },

  updatePersona: async (id: number, persona: any): Promise<any> => {
    try {
      const response = await axios.put(`/personas/${id}`, persona);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar persona con ID ${id}:`, error);
      throw error;
    }
  },

  deletePersona: async (id: number): Promise<void> => {
    try {
      await axios.delete(`/personas/${id}`);
    } catch (error) {
      console.error(`Error al eliminar persona con ID ${id}:`, error);
      throw error;
    }
  },

  addDomicilio: async (personaId: number, domicilio: any): Promise<any> => {
    try {
      // Eliminar el campo id si existe
      const { id, ...domicilioSinId } = domicilio;
      const response = await axios.post(`/domicilios/persona/${personaId}`, domicilioSinId);
      return response.data;
    } catch (error) {
      console.error(`Error al agregar domicilio a la persona con ID ${personaId}:`, error);
      throw error;
    }
  },

  updateDomicilio: async (domicilioId: number, domicilio: any): Promise<any> => {
    try {
      const response = await axios.put(`/domicilios/${domicilioId}`, domicilio);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar domicilio con ID ${domicilioId}:`, error);
      throw error;
    }
  },

  deleteDomicilio: async (domicilioId: number): Promise<void> => {
    try {
      await axios.delete(`/domicilios/${domicilioId}`);
    } catch (error) {
      console.error(`Error al eliminar domicilio con ID ${domicilioId}:`, error);
      throw error;
    }
  },

  // Búsquedas específicas
  searchByNumero: async (numero: string) => {
    const response = await axios.get(`/expedientes/search?numero=${numero}`);
    return response.data;
  },
  
  searchByCaratula: async (caratula: string) => {
    const response = await axios.get(`/expedientes/search?caratula=${caratula}`);
    return response.data;
  },
  
  // Vínculos con personas
  getVinculos: async (expedienteId: number) => {
    try {
      const response = await axios.get(`/expedientes/${expedienteId}/vinculos`);
      return response.data;
    } catch (error: any) {
      console.error(`Error al obtener vínculos del expediente ${expedienteId}:`, error);
      throw new Error(error.response?.data?.message || 'Error al obtener vínculos');
    }
  },
  
  createVinculo: async (vinculo: Vinculo) => {
    try {
      const response = await axios.post(`/expedientes/vinculos`, vinculo);
      return response.data;
    } catch (error: any) {
      console.error('Error al crear vínculo:', error);
      throw new Error(error.response?.data?.message || 'Error al crear vínculo');
    }
  },
  
  addVinculo: async (vinculo: Vinculo) => {
    const response = await axios.post(`/expedientes/vinculos`, vinculo);
    return response.data;
  },
  
  deleteVinculo: async (id: number) => {
    try {
      const response = await axios.delete(`/expedientes/vinculos/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error al eliminar vínculo ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al eliminar vínculo');
    }
  },
  
  // Delitos asociados
  getDelitos: async (expedienteId: number) => {
    try {
      const response = await axios.get(`/expedientes/${expedienteId}/delitos`);
      return response.data;
    } catch (error: any) {
      console.error(`Error al obtener delitos del expediente ${expedienteId}:`, error);
      throw new Error(error.response?.data?.message || 'Error al obtener delitos');
    }
  },
  
  createExpedienteDelito: async (expedienteDelito: ExpedienteDelito) => {
    const response = await axios.post(`/expedientes/delitos`, expedienteDelito);
    return response.data;
  },
  
  deleteExpedienteDelito: async (id: number) => {
    const response = await axios.delete(`/expedientes/delitos/${id}`);
    return response.data;
  },
  
  // Métodos específicos de búsqueda y filtrado
  buscarExpedientes: async (params: any) => {
    const response = await axios.get(`/expedientes/buscar`, { params });
    return response.data;
  },
  
  // Otros métodos de utilidad
  changeStatus: async (id: number, estado: string) => {
    const response = await axios.patch(`/expedientes/${id}/estado`, { estado });
    return response.data;
  },
  
  // Método para actualizar solo ciertos campos
  patchExpediente: async (id: number, datos: Partial<Expediente>) => {
    const response = await axios.patch(`/expedientes/${id}`, datos);
    return response.data;
  },
  
  // Método para eliminar de forma lógica
  deleteLogico: async (id: number) => {
    const response = await axios.delete(`/expedientes/${id}/logico`);
    return response.data;
  },
  
  // Método para delitos asociados
  deleteDelitoAsociado: async (id: number) => {
    const response = await axios.delete(`/expedientes/delitos/${id}`);
    return response.data;
  },

  // Método para marcar una foto como principal en un expediente
  setFotoPrincipal: async (expedienteId: number, fotoId: number) => {
    try {
      const response = await axios.put(`/expedientes/${expedienteId}/foto-principal/${fotoId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al marcar fotografía con ID ${fotoId} como principal en el expediente ${expedienteId}:`, error);
      throw error;
    }
  },

  // Gestión de medios de comunicación
  getMediosComunicacion: async (personaId: number): Promise<any[]> => {
    try {
      const response = await axios.get(`/medios-comunicacion/persona/${personaId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener medios de comunicación de la persona ${personaId}:`, error);
      throw error;
    }
  },

  addMedioComunicacion: async (personaId: number, medio: any): Promise<any> => {
    try {
      const { id, ...medioSinId } = medio;
      const response = await axios.post(`/medios-comunicacion/persona/${personaId}`, medioSinId);
      return response.data;
    } catch (error) {
      console.error(`Error al agregar medio de comunicación a la persona con ID ${personaId}:`, error);
      throw error;
    }
  },

  updateMedioComunicacion: async (medioId: number, medio: any): Promise<any> => {
    try {
      const response = await axios.put(`/medios-comunicacion/${medioId}`, medio);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar medio de comunicación con ID ${medioId}:`, error);
      throw error;
    }
  },

  deleteMedioComunicacion: async (medioId: number): Promise<void> => {
    try {
      await axios.delete(`/medios-comunicacion/${medioId}`);
    } catch (error) {
      console.error(`Error al eliminar medio de comunicación con ID ${medioId}:`, error);
      throw error;
    }
  },
};

export default expedienteService; 