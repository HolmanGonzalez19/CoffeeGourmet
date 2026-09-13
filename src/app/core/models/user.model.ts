export interface User {
  id: number;
  nombre: string;
  usuario: string;
  activo: boolean;
}

export interface UsersAdmin {
  activo: boolean;
  fechaActualizacion: string;
  fechaCreacion: string;
  id: number;
  nombre: string;
  rolId: number;
  rolNombre: string;
  usuario: string;
}

export interface UserForm {
  nombre: string | null;
  usuario: string | null;
  password: string | null;
  pin: string | null;
  rol: number | null;
}

export interface CreateUserRequest {
  nombre: string;
  usuario: string;
  password: string | null;
  pin: string | null;
  rolId: number | null;
}

export interface UpdateUserRequest {
  nombre: string;
  usuario: string;
  password: string | null;
  pin: string | null;
  rolId: number | null;
  activo: boolean;
}