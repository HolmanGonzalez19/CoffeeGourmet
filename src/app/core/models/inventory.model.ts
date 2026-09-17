export interface Inventory {

  id: number;

  productoId: number;

  productoNombre: string;

  stockMinimo: number;

  cantidadActual: number;

  fechaCreacion: string;

  fechaActualizacion: string;

}


export interface InventoryMovement {

  id: number;

  productoId: number;

  productoNombre: string;

  usuarioId: number;

  usuarioNombre: string;

  tipoMovimiento: 'ENTRADA' | 'SALIDA' | 'AJUSTE';

  cantidad: number;

  motivo: string | null;

  referencia: string;

  fecha: string;

}


export interface CreateInventoryMovementRequest {

  productoId: number;

  usuarioId: number;

  tipoMovimiento: string | null;

  cantidad: number;

  motivo: string | null;

  compraId: number | null;

}


export interface InventoryReference {

  tipo: string;

  id: number;

  referencia: string;

  descripcion: string;

}

export interface RegisterMovementData {
  item: Inventory;
  movimientoForm: MovimientoForm;
}

export interface MovimientoForm {
  productoId: number |null;
  usuarioId: number;
  tipoMovimiento: string;
  cantidad: number;
  motivo: string | null;
  compraId: number | null;
}
