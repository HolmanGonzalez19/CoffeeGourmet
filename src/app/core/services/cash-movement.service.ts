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
  CashMovement,
  CreateCashMovementRequest
} from '../models/cash-movement.model';


@Injectable({
  providedIn: 'root'
})
export class CashMovementService {

  private readonly http =
    inject(HttpClient);


  private readonly endpoint =
    '/api/cash-movements';


  // ============================================================
  // CONSULTAR MOVIMIENTOS DE UNA CAJA
  // ============================================================

  findByCashRegister(
    cajaId: number
  ): Observable<CashMovement[]> {

    return this.http.get<CashMovement[]>(
      `${this.endpoint}/cash-register/${cajaId}`
    );

  }


  // ============================================================
  // REGISTRAR MOVIMIENTO DE CAJA
  // ============================================================

  create(
    cajaId: number,
    request: CreateCashMovementRequest
  ): Observable<CashMovement> {

    return this.http.post<CashMovement>(
      `${this.endpoint}/cash-register/${cajaId}`,
      request
    );

  }

}