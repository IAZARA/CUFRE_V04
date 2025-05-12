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
      // Intentar con el endpoint antiguo
      try {
        const responseAlt = await axios.get(`${API_URL}/estadisticas/estado`);
        // Convertir formato antiguo {estado: cantidad} al nuevo formato [{name, value}]
        return Object.entries(responseAlt.data).map(([estado, cantidad]) => ({
          name: estado,
          value: Number(cantidad)
        }));
      } catch (altError) {
        console.error('Error en endpoint alternativo:', altError);
        // Datos simulados en caso de error (solo estados que existen en el sistema)
        return [
          { name: 'Captura Vigente', value: 0 },
          { name: 'Detenido', value: 0 },
          { name: 'Sin Efecto', value: 0 }
        ];
      }
    }
  },

  getExpedientesPorFuerza: async () => {
    try {
      const response = await axios.get(`${API_URL}/estadisticas/expedientes-por-fuerza`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener expedientes por fuerza:', error);
      // Datos simulados en caso de error
      return [
        { name: 'PFA', value: 0 },
        { name: 'GNA', value: 0 },
        { name: 'PNA', value: 0 },
        { name: 'PSA', value: 0 },
        { name: 'SPF', value: 0 },
        { name: 'INTERPOOL', value: 0 },
        { name: 'CUFRE', value: 0 }
      ];
    }
  },

  getExpedientesPorEstadoYFuerza: async (fuerza: string) => {
    try {
      const response = await axios.get(`${API_URL}/estadisticas/expedientes-por-estado-y-fuerza/${fuerza}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error al obtener expedientes por estado para la fuerza ${fuerza}:`, error);
      // No se lanza error para que el frontend maneje el fallback
      return [];
    }
  },

  getExpedientesPorFuerzaYEstado: async (estado: string) => {
    try {
      const response = await axios.get(`${API_URL}/estadisticas/expedientes-por-fuerza-y-estado/${estado}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error al obtener expedientes por fuerza para el estado ${estado}:`, error);
      // No se lanza error para que el frontend maneje el fallback
      return [];
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
        { name: 'Buenos Aires', value: 350 },
        { name: 'CABA', value: 280 },
        { name: 'Córdoba', value: 175 },
        { name: 'Santa Fe', value: 145 },
        { name: 'Mendoza', value: 98 }
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
        { name: 'Robo', value: 245 },
        { name: 'Hurto', value: 189 },
        { name: 'Estafa', value: 142 },
        { name: 'Lesiones', value: 98 },
        { name: 'Amenazas', value: 76 }
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
        { name: 'Manual', value: 450 },
        { name: 'Importación', value: 350 },
        { name: 'API', value: 250 },
        { name: 'Escáner', value: 150 }
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
        { name: '2023-Q1', value: 125 },
        { name: '2023-Q2', value: 157 },
        { name: '2023-Q3', value: 189 },
        { name: '2023-Q4', value: 205 },
        { name: '2024-Q1', value: 218 }
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