import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { PriceHistory } from '../models/price-history.model';

@Injectable({
  providedIn: 'root'
})
export class PriceHistoryService {

  private readonly http = inject(HttpClient);

  private readonly endpoint = '/api/price-history';

  /**
   * Obtiene todo el historial de precios de un producto.
   */
  getByProduct(productId: number): Observable<PriceHistory[]> {

    return this.http.get<PriceHistory[]>(
      `${this.endpoint}/product/${productId}`
    );
  }

  /**
   * Obtiene únicamente el precio vigente del producto.
   *
   * El backend puede devolver varios registros históricos,
   * por lo que el frontend toma solamente el que esté activo.
   */
  getActiveByProduct(
    productId: number
  ): Observable<PriceHistory | null> {

    return this.getByProduct(productId).pipe(

      map(history => {

        return history.find(
          price => price.activo
        ) ?? null;

      })

    );
  }
}