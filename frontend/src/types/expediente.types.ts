export interface Expediente {
  id?: number;
  numero: string;
  fechaIngreso: string;
  estadoSituacion: string;
  fuerzaAsignada: string;
  fechaAsignacion: string;
  autorizacionTareas: string;
  fechaAutorizacionTareas: string;
  descripcion: string;
  prioridad: number;
  recompensa: string;
  
  // Información de la causa judicial
  fechaOficio: string;
  numeroCausa: string;
  caratula: string;
  juzgado: string;
  secretaria: string;
  fiscalia: string;
  jurisdiccion: string;
  provincia: string;
  tipoCaptura: string;
  pais: string;
  motivoCaptura: string;
  disposicionJuzgado: string;
  
  // Datos del prófugo
  profugoTez: string;
  profugoContexturaFisica: string;
  profugoCabello: string;
  profugoOjos: string;
  profugoEstatura: number;
  profugoPeso: number;
  profugoGenero: string;
  profugoNivelEstudios: string;
  profugoSituacionLaboral: string;
  profugoOcupacion: string;
  profugoEstadoCivil: string;
  profugoVinculosFamiliares: string;
  profugoAntecedentes: boolean;
  profugoAntecedentesDescripcion: string;
  profugoDiscapacidadFlag: boolean;
  profugoDiscapacidadDesc: string;
  profugoNombreCompleto: string;
  profugoDni: string;
  
  // Campos adicionales del prófugo (que faltan según los errores)
  profugoMarcasVisibles: string;
  profugoProfesionOcupacion: string;
  profugoGrupoSanguineo: string;
  profugoTelefono: string;
  profugoAntecedentesPenales: boolean;
  profugoDetalleAntecedentes: string;
  profugoSituacionProcesal: string;
  profugoNumeroProntuario: string;
  profugoUltimaVezVisto: string;
  profugoEstabaDetenido: boolean;
  profugoNumeroDetencionesPrevias: number;
  
  // Datos del hecho
  fechaHecho: string;
  horaHecho: string;
  lugarHecho: string;
  localidadHecho: string;
  provinciaHecho: string;
  paisHecho: string;
  tipoDano: string;
  modusOperandi: string;
  motivacion: string;
  armasUtilizadas: boolean;
  tipoArmas: string;
  numeroVictimas: number;
  victimaMenorEdad: boolean;
  
  // Campos adicionales del hecho (que faltan según los errores)
  descripcionHecho: string;
  mediaticoFlag: boolean;
  usoArmasFuegoFlag: boolean;
  usoArmasBlancasFlag: boolean;
  peligrosidadFlag: boolean;
  numeroComplices: number;
  antecedentesFlag: boolean;
  reincicenteFlag: boolean;
  reiteranteFlag: boolean;
  detalleAntecedentes: string;
  
  // Datos de detencion
  fechaDetencion: string;
  lugarDetencion: string;
  fuerzaDetencion: string;
  descripcionProcedimiento: string;
  
  // Datos de organizacion
  bandaFlag: boolean;
  terrorismoFlag: boolean;
  nombreBanda: string;
  nivelOrganizacion: string;
  ambitoBanda: string;
  capacidadOperativa: string;
  planificacionFlag: boolean;
  patronesRepetitivos: boolean;
  conexionesOtrasActividadesFlag: boolean;
  
  // Datos de impacto
  impactoMediatico: string;
  impactoSocial: string;
  nivelPeligrosidad: number;
  circulaFlag: boolean;
  ampliacionCircula: string;
  informacionContextoAdicional: string;
  
  // Datos de entidades externas
  delitos: string[];
  fotografias: Fotografia[];
  documentos: Documento[];
  personas: PersonaExpediente[];
  
  // Datos adicionales
  created_at: string;
  updated_at: string;
  
  // Campos antiguos por mantener compatibilidad
  fechaUltimaActualizacion?: string;
  departamento?: string;
  estado?: string;
  instancia?: string;
  observaciones?: string;
  tienePrioridad?: boolean;
  esReservado?: boolean;
  
  // Adicional - Compatibilidad con frontend
  fechaInicio?: string;
}

export interface ExpedienteDelito {
  id?: number;
  expedienteId: number;
  delitoId: number;
  delitoNombre?: string;
  delitoEsGrave?: boolean;
  delitoArticulo?: string;
  delitoLey?: string;
  fechaRegistro?: string;
  observaciones?: string;
}

export interface Vinculo {
  id?: number;
  expedienteId: number;
  personaId: number;
  personaNombre?: string;
  personaApellido?: string;
  personaDocumento?: string;
  tipo: string; // 'Imputado', 'Víctima', 'Testigo', etc.
  observaciones?: string;
}

export interface Delito {
  id?: number;
  nombre: string;
  articulo?: string;
  codigo?: string;
  ley?: string;
  descripcion?: string;
  observaciones?: string;
  esGrave: boolean;
}

export interface Documento {
  id?: number;
  url: string;
  nombre: string;
  tipo: string;
  descripcion: string;
  file?: File; // Objeto File para subir al servidor
}

export interface Fotografia {
  id?: number;
  url: string;
  tipo: string;
  descripcion: string;
  file?: File; // Objeto File para subir al servidor
}

export interface PersonaExpediente {
  id?: number;
  dni: string;
  nombre: string;
  apellido: string;
  tipoRelacion: string;
  informacionAdicional: string;
} 