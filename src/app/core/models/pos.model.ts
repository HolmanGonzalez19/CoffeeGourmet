export interface SaleItemPos {
  productoId: number;
  codigo: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  precioVariable: boolean;
}

export interface VentaPos {
  items: SaleItemPos[];
}

export interface ProductPos {
  id: number;
  codigo: string;
  codigoBarras: string | null;
  nombre: string;
  categoriaId: number;
  categoriaNombre: string;
  tipoProducto: string;
  precioVenta: number | null;
  imagen: string | null;
  precioVariable: boolean;
}