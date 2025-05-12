export enum Rol {
  SUPERUSUARIO = 'SUPERUSUARIO',
  ADMINISTRADOR = 'ADMINISTRADOR',
  OPERADOR = 'OPERADOR',
  VISUALIZADOR = 'VISUALIZADOR',
  USUARIOCARGA = 'USUARIOCARGA',
  USUARIOCONSULTA = 'USUARIOCONSULTA'
}

export interface Usuario {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  password?: string;
  rol: Rol;
  activo: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Interfaces específicas para los diferentes tipos de respuestas
export interface SuccessAuthResponse {
  token: string;
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
}

export interface PasswordChangeRequired {
  action: 'cambiar_contrasena';
  message: string;
}

export interface TwoFactorActivationRequired {
  action: 'activar_2fa';
  message: string;
  temp_token?: string;
}

export interface TwoFactorValidationRequired {
  action: 'validar_2fa';
  message: string;
  email?: string;
  temp_token?: string;
}

// Tipo unión para AuthResponse
export type AuthResponse = SuccessAuthResponse
  | PasswordChangeRequired
  | TwoFactorActivationRequired
  | TwoFactorValidationRequired; 