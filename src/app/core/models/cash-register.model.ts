export interface CashRegister {
  id: number;

  usuarioAperturaId: number;
  usuarioAperturaNombre: string;

  fechaApertura: string;
  montoInicial: number;

  estado: 'ABIERTA' | 'CERRADA';

  usuarioCierreId: number | null;
  usuarioCierreNombre: string | null;

  fechaCierre: string | null;

  efectivoEsperado: number | null;
  efectivoContado: number | null;
  diferencia: number | null;

  ventasEfectivo: number;
  ventasTransferencia: number;
  ventasTotales: number;
}

export interface OpenCashRegisterRequest {
  montoInicial: number;
}