import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  CreateSaleRequest,
  SaleResponse
} from '../models/sale.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private readonly http = inject(HttpClient);

  private readonly endpoint = '/api/sales';

  create(request: CreateSaleRequest): Observable<SaleResponse> {
    return this.http.post<SaleResponse>(
      this.endpoint,
      request
    );
  }
}