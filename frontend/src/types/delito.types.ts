export interface Delito {
  id?: number;
  nombre: string;
  descripcion?: string;
  articulo?: string;
  ley?: string;
  codigo?: string;
  esGrave: boolean;
  codigoInterno?: string;
  penaMinima?: string;
  penaMaxima?: string;
  observaciones?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  codigoPenal?: string;
  tipoPena?: string;
  valoracion?: number;
} 