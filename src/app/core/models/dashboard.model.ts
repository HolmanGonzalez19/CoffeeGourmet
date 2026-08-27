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

  ventasRecientes: VentaReciente[];
  distribucionVentas: DistribucionVenta[];
  productosMasVendidos: ProductoMasVendido[];
  ventasPorMes: VentaPorMes[];
}

export interface VentaReciente {
  id: number;
  fechaHora: string;
  cantidadProductos: number;
  total: number;
  metodoPago: string;
}

export interface DistribucionVenta {
  metodoPago: string;
  total: number;
  porcentaje: number;
}

export interface ProductoMasVendido {
  productoId: number;
  producto: string;
  cantidadVendida: number;
}

export interface VentaPorMes {
  mes: string;
  total: number;
}