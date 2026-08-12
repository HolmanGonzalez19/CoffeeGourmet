export interface PriceHistory {
  id: number;
  productoId: number;
  productoNombre: string;
  precioCompra: number;
  precioVenta: number;
  fechaInicio: string;
  fechaFin: string | null;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}