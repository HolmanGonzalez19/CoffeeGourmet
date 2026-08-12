import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { PaymentMethod } from '../models/payment-method.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  private readonly http = inject(HttpClient);

  private readonly endpoint = '/api/payment-methods';

  getActive(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(this.endpoint).pipe(
      map(methods =>
        methods.filter(method => method.activo)
      )
    );
  }
}