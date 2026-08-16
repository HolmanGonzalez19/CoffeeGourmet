export type CashMovementType =
  | 'INGRESO'
  | 'RETIRO';


export interface CashMovement {

  id: number;

  cajaId: number;

  usuarioId: number;

  usuarioNombre: string;

  tipoMovimiento: CashMovementType;

  monto: number;

  descripcion: string | null;

  fechaMovimiento: string;
}


export interface CreateCashMovementRequest {

  tipoMovimiento: CashMovementType;

  monto: number;

  descripcion?: string;
}