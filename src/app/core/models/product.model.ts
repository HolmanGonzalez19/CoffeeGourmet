export interface Product {
  id: number;
  categoriaId: number;
  categoriaNombre: string;
  codigo: string;
  codigoBarras: string | null;
  nombre: string;
  descripcion: string | null;
  tipoProducto: 'FABRICADO' | 'COMPRADO';
  stockMinimo: number;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}