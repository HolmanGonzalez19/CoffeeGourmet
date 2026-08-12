export interface LoginRequest {
  usuario: string;
  password: string;
}

export interface PinLoginRequest {
  pin: string;
}

export interface AuthenticationResponse {
  token: string;
  usuarioId: number;
  nombre: string;
  usuario: string;
  rolId: number;
  rolNombre: string;
  permisos: string[];
}

export interface AuthUser {
  usuarioId: number;
  nombre: string;
  usuario: string;
  rolId: number;
  rolNombre: string;
  permisos: string[];
}