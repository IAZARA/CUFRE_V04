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

export type AuthResponse =
  | {
      token: string;
      id: number;
      nombre: string;
      email: string;
      rol: Rol;
    }
  | {
      action: 'cambiar_contrasena' | 'activar_2fa';
      message: string;
    }; 