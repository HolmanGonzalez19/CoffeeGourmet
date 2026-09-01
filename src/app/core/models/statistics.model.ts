export interface ProductSale {
    productoId: number;
    producto: string;
    cantidadVendida: number;
}

export interface Statistics {
    totalVentas: number;
    totalIngresos: number;
    totalProductosVendidos: number;
    productosMasVendidos: ProductSale[];
}