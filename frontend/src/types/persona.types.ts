export interface Persona {
  id?: number;
  nombre: string;
  apellido: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento?: string;
  sexo?: string;
  nacionalidad?: string;
  estadoCivil?: string;
  ocupacion?: string;
  observaciones?: string;
}

export interface Domicilio {
  id?: number;
  personaId: number;
  calle: string;
  numero: string;
  piso?: string;
  departamento?: string;
  codigoPostal?: string;
  localidad: string;
  provincia: string;
  pais: string;
  esDomicilioLegal: boolean;
  observaciones?: string;
  tipo?: string;
}

export interface MedioComunicacion {
  id?: number;
  personaId: number;
  tipo: string; // 'EMAIL', 'TELEFONO', 'RED_SOCIAL', etc.
  valor: string;
  observaciones?: string;
}

export interface Identificacion {
  id?: number;
  personaId: number;
  tipo: string; // 'PASAPORTE', 'LICENCIA_CONDUCIR', etc.
  numero: string;
  fechaEmision?: string;
  fechaVencimiento?: string;
  emisor?: string;
  observaciones?: string;
} 