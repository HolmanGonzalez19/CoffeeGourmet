export interface Dashboard {
  ventasHoy: number;
  totalVentasHoy: number;
  productosVendidosHoy: number;
  cajaAbiertaId: number | null;
  efectivoInicial: number;
  efectivoEsperado: number;
  productosStockBajo: number;
  totalVentas: number;
  totalIngresos: number;
  totalCompras: number;
  totalEgresos: number;
  totalProductos: number;
}