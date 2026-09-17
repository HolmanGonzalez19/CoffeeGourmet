export interface Supplier {
    id: number;
    nombre: string;
    nit: string | null;
    telefono: string | null;
    correo: string | null;
    direccion: string | null;
    activo: boolean;
}

export interface GetSuppliers {
  id: number;
  nombre: string;
  contacto: string;
  telefono: string;
  correo: string;
  direccion: string;
  observacion: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface CreateSupplierRequest {
  nombre: string;
  contacto: string;
  telefono: string;
  correo: string;
  direccion: string;
  observacion: string;
  activo: boolean;
}

export interface UpdateSupplierRequest {
  nombre: string;
  contacto: string;
  telefono: string;
  correo: string;
  direccion: string;
  observacion: string;
  activo: boolean;
}

export interface SuppliersForm {
  nombre: string | null;
  contacto: string| null;
  telefono: string| null;
  correo: string| null;
  direccion: string| null;
  observacion: string| null;
  activo: boolean | null;
}