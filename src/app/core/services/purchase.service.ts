import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Purchase,
  CreatePurchaseRequest,
  CancelPurchaseRequest
} from '../models/purchase.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'api/purchases';

  getAll(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(this.apiUrl);
  }

  getById(id: number): Observable<Purchase> {
    return this.http.get<Purchase>(
      `${this.apiUrl}/${id}`
    );
  }

  getToday(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(
      `${this.apiUrl}/today`
    );
  }

  getCurrentMonth(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(
      `${this.apiUrl}/month`
    );
  }

  create(
    request: CreatePurchaseRequest
  ): Observable<Purchase> {

    return this.http.post<Purchase>(
      this.apiUrl,
      request
    );
  }

  cancel(
    id: number,
    request: CancelPurchaseRequest
  ): Observable<void> {

    return this.http.patch<void>(
      `${this.apiUrl}/${id}/cancel`,
      request
    );
  }
}