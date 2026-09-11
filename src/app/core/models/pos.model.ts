export interface SaleItemPos {
  productoId: number;
  codigo: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface VentaPos {
  items: SaleItemPos[];
}
