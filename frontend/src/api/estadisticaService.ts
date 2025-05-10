import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const estadisticaService = {
  getDashboardData: async () => {
    try {
      const response = await axios.get(`${API_URL}/estadisticas/dashboard`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener datos del dashboard:', error);
      // Si el backend aún no implementa esta funcionalidad, devolver datos simulados
      return {
        totalExpedientes: 1256,
        totalDelitos: 87,
        totalPersonas: 3254,
        informesDisponibles: 42,
        expedientesPorEstado: {
          'En Trámite': 450,
          'Archivado': 320,
          'Finalizado': 280,
          'Pendiente': 206
        },
        delitosMasFrecuentes: [
          { nombre: 'Robo', cantidad: 245 },
          { nombre: 'Hurto', cantidad: 189 },
          { nombre: 'Estafa', cantidad: 142 },
          { nombre: 'Lesiones', cantidad: 98 },
          { nombre: 'Amenazas', cantidad: 76 }
        ],
        expedientesPorMes: [
          { mes: 'Ene', cantidad: 45 },
          { mes: 'Feb', cantidad: 52 },
          { mes: 'Mar', cantidad: 49 },
          { mes: 'Abr', cantidad: 63 },
          { mes: 'May', cantidad: 59 },
          { mes: 'Jun', cantidad: 78 },
          { mes: 'Jul', cantidad: 82 },
          { mes: 'Ago', cantidad: 71 },
          { mes: 'Sep', cantidad: 56 },
          { mes: 'Oct', cantidad: 68 },
          { mes: 'Nov', cantidad: 72 },
          { mes: 'Dic', cantidad: 45 }
        ]
      };
    }
  },

  getExpedientesPorEstado: async () => {
    try {
      const response = await axios.get(`${API_URL}/estadisticas/expedientes-por-estado`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener expedientes por estado:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  },

  getDelitosPorTipo: async () => {
    try {
      const response = await axios.get(`${API_URL}/estadisticas/delitos-por-tipo`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener delitos por tipo:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  },

  getExpedientesPorPeriodo: async (inicio: string, fin: string) => {
    try {
      const response = await axios.get(`${API_URL}/estadisticas/expedientes-por-periodo`, {
        params: { inicio, fin }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener expedientes por período:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  },

  getExpedientesPorProvincia: async () => {
    try {
      const response = await axios.get(`${API_URL}/estadisticas/expedientes-por-provincia`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener expedientes por provincia:', error);
      // Datos simulados en caso de error
      return [
        { provincia: 'Buenos Aires', cantidad: 350 },
        { provincia: 'CABA', cantidad: 280 },
        { provincia: 'Córdoba', cantidad: 175 },
        { provincia: 'Santa Fe', cantidad: 145 },
        { provincia: 'Mendoza', cantidad: 98 }
      ];
    }
  },

  getExpedientesPorDelito: async () => {
    try {
      const response = await axios.get(`${API_URL}/estadisticas/expedientes-por-delito`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener expedientes por delito:', error);
      // Datos simulados en caso de error
      return [
        { delito: 'Robo', cantidad: 245 },
        { delito: 'Hurto', cantidad: 189 },
        { delito: 'Estafa', cantidad: 142 },
        { delito: 'Lesiones', cantidad: 98 },
        { delito: 'Amenazas', cantidad: 76 }
      ];
    }
  },

  getExpedientesPorTipoCaptura: async () => {
    try {
      const response = await axios.get(`${API_URL}/estadisticas/expedientes-por-tipo-captura`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener expedientes por tipo de captura:', error);
      // Datos simulados en caso de error
      return [
        { tipoCaptura: 'Manual', cantidad: 450 },
        { tipoCaptura: 'Importación', cantidad: 350 },
        { tipoCaptura: 'API', cantidad: 250 },
        { tipoCaptura: 'Escáner', cantidad: 150 }
      ];
    }
  },

  getExpedientesPorTiempo: async () => {
    try {
      const response = await axios.get(`${API_URL}/estadisticas/expedientes-por-tiempo`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener expedientes por tiempo:', error);
      // Datos simulados en caso de error
      return [
        { periodo: '2023-Q1', cantidad: 125 },
        { periodo: '2023-Q2', cantidad: 157 },
        { periodo: '2023-Q3', cantidad: 189 },
        { periodo: '2023-Q4', cantidad: 205 },
        { periodo: '2024-Q1', cantidad: 218 }
      ];
    }
  },

  getEstadisticasGenerales: async () => {
    try {
      const response = await axios.get(`${API_URL}/estadisticas/generales`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener estadísticas generales:', error);
      // Datos simulados en caso de error
      return {
        totalExpedientes: 1256,
        expedientesActivos: 780,
        expedientesArchivados: 476,
        expedientesUltimoMes: 68,
        tiempoPromedioResolucion: '45 días',
        delitosRegistrados: 87
      };
    }
  },

  getEstadisticasPersonas: async () => {
    try {
      const response = await axios.get(`${API_URL}/estadisticas/personas`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener estadísticas de personas:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  },

  getReporteCompleto: async () => {
    try {
      const response = await axios.get(`${API_URL}/estadisticas/reporte-completo`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener reporte completo:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener reporte');
    }
  },

  exportarEstadisticas: async (formato: string) => {
    try {
      const response = await axios.get(`${API_URL}/estadisticas/exportar`, {
        params: { formato },
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      console.error('Error al exportar estadísticas:', error);
      throw new Error(error.response?.data?.message || 'Error al exportar estadísticas');
    }
  }
};

export default estadisticaService; 