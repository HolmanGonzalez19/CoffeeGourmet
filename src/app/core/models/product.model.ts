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
  precioVenta: number | null;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}