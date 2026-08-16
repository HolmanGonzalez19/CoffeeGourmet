export type CashRegisterStatus =
  | 'ABIERTA'
  | 'CERRADA';


export interface CashRegisterStatusResponse {

  estado: CashRegisterStatus;

}