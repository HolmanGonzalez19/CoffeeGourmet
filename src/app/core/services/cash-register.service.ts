import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  CashRegister,
  OpenCashRegisterRequest,
  CloseCashRegisterRequest
} from '../models/cash-register.model';

import {
  CashRegisterStatusResponse
} from '../models/cash-register-status.model';


@Injectable({
  providedIn: 'root'
})
export class CashRegisterService {

  private readonly http =
    inject(HttpClient);


  private readonly endpoint =
    '/api/cash-register';


  // ============================================================
  // CONSULTAR ESTADO ACTUAL DE LA CAJA
  // ============================================================

  /**
   * Consulta únicamente el estado de la caja actual.
   *
   * Este endpoint es público y no devuelve información
   * financiera ni administrativa de la caja.
   */
  getCurrent():
    Observable<CashRegisterStatusResponse> {

    return this.http.get<CashRegisterStatusResponse>(
      `${this.endpoint}/current`
    );

  }

  getOpen(): Observable<CashRegister> {

  return this.http.get<CashRegister>(
    `${this.endpoint}/open`
  );

}


  // ============================================================
  // ABRIR CAJA
  // ============================================================

  open(
    request: OpenCashRegisterRequest
  ): Observable<CashRegister> {

    return this.http.post<CashRegister>(
      `${this.endpoint}/open`,
      request
    );

  }


  // ============================================================
  // CERRAR CAJA
  // ============================================================

  close(
    id: number,
    request: CloseCashRegisterRequest
  ): Observable<CashRegister> {

    return this.http.patch<CashRegister>(
      `${this.endpoint}/${id}/close`,
      request
    );

  }

}