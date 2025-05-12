import axiosClient from './axiosClient';

export interface ActividadSistema {
  id: number;
  usuario: string;
  tipoAccion: string;
  fechaHora: string;
  detalles: string;
}

const actividadSistemaService = {
  /**
   * Obtiene la lista de actividades del sistema
   */
  obtenerTodasLasActividades: async (): Promise<ActividadSistema[]> => {
    const response = await axiosClient.get('/api/actividad-sistema');
    return response.data;
  }
};

export default actividadSistemaService;