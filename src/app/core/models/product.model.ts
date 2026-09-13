export interface Product {
  id: number;
  categoriaId: number;
  categoriaNombre: string;
  codigo: string;
  codigoBarras: string | null;
  nombre: string;
  descripcion: string | null;
  stockMinimo: number;
  tipoProducto: string;
  precioCompra: number | null;
  precioVenta: number | null;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface ProductTypes{
  codigo: string;
  nombre: string;
}

export interface ProductForm {
  nombre: string;
  categoriaId: number | null;
  tipoProducto: string | null;
  codigoBarras: string | null;
  stockMinimo: number | null;
  descripcion: string | null;
  precioCompra: number | null;
  precioVenta: number | null;
}

export interface CreateProductRequest {
  nombre: string;
  categoriaId: number;
  tipoProducto: string;
  codigoBarras: string | null;
  stockMinimo: number;
  descripcion: string | null;
  precioCompra: number | null;
  precioVenta: number | null;
}

export interface UpdateProductRequest {
  nombre: string;
  categoriaId: number;
  tipoProducto: string;
  codigoBarras: string | null;
  stockMinimo: number;
  descripcion: string | null;
  precioCompra: number | null;
  precioVenta: number | null;
}

