export interface CashRegister {
  id: number;
  usuarioAperturaId: number;
  fechaApertura: string;
  montoInicial: number;
  estado: 'ABIERTA' | 'CERRADA';
  usuarioCierreId: number | null;
  fechaCierre: string | null;
  efectivoEsperado: number | null;
  efectivoContado: number | null;
  diferencia: number | null;
}

export interface OpenCashRegisterRequest {
  montoInicial: number;
}