export interface PurchaseDetail {
  id: number;
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precioCompra: number;
  subtotal: number;
}

export interface Purchase {
  id: number;
  codigoCompra: string;
  proveedorId: number;
  proveedorNombre: string;
  usuarioId: number;
  usuarioNombre: string;
  fecha: string;
  total: number;
  observacion: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  estado: 'REGISTRADA' | 'ANULADA';
  detalles: PurchaseDetail[];
}

export interface CreatePurchaseDetailRequest {
  productoId: number;
  cantidad: number;
  precioCompra: number;
}

export interface CreatePurchaseRequest {
  proveedorId: number;
  usuarioId: number;
  observacion: string | null;
  detalles: CreatePurchaseDetailRequest[];
}

export interface CancelPurchaseRequest {
  usuarioId: number;
  motivo: string;
}