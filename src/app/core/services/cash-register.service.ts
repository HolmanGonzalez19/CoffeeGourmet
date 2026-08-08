import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CashRegister,
  OpenCashRegisterRequest
} from '../models/cash-register.model';

@Injectable({
  providedIn: 'root'
})
export class CashRegisterService {
  private readonly http = inject(HttpClient);

  private readonly endpoint = '/api/cash-register';

  getCurrent(): Observable<CashRegister | null> {
    return this.http.get<CashRegister | null>(
      `${this.endpoint}/current`
    );
  }

  open(request: OpenCashRegisterRequest): Observable<CashRegister> {
    return this.http.post<CashRegister>(
      `${this.endpoint}/open`,
      request
    );
  }
}