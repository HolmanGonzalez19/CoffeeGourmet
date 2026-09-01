export interface CreateSaleDetailRequest {
  productoId: number;
  cantidad: number;
}

export interface CreateSaleRequest {
  usuarioId: number;
  metodoPagoId: number;
  observacion?: string;
  detalles: CreateSaleDetailRequest[];
}

export interface SaleDetailResponse {
  id: number;
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface SaleResponse {
  id: number;
  usuarioId: number;
  usuarioNombre: string;
  metodoPagoId: number;
  metodoPagoNombre: string;
  fechaHora: string;
  total: number;
  observacion: string | null;
  estado: string;
  fechaAnulacion: string | null;
  usuarioAnulacionId: number | null;
  usuarioAnulacionNombre: string | null;
  motivoAnulacion: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  detalles: SaleDetailResponse[];
}

export interface SalePageResponse {
  content: SaleResponse[];

  pageNumber: number;
  pageSize: number;

  totalElements: number;
  totalPages: number;

  first: boolean;
  last: boolean;
}