import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  CreateSaleRequest,
  SaleResponse
} from '../models/sale.model';


export interface SaleFilters {

  cajaId?: number;

  usuarioId?: number;

  metodoPagoId?: number;

  estado?: string;

  fechaInicio?: string;

  fechaFin?: string;

}


export interface PagedResponse<T> {

  content: T[];

  page: number;

  size: number;

  totalElements: number;

  totalPages: number;

  first: boolean;

  last: boolean;

}


@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private readonly http = inject(HttpClient);

  private readonly endpoint = '/api/sales';


  create(
    request: CreateSaleRequest
  ): Observable<SaleResponse> {

    return this.http.post<SaleResponse>(
      this.endpoint,
      request
    );

  }


  findWithFilters(
    filters: SaleFilters,
    page: number = 0,
    size: number = 200
  ): Observable<PagedResponse<SaleResponse>> {

    let params = new HttpParams()
      .set('page', page)
      .set('size', size);


    if (filters.cajaId != null) {

      params = params.set(
        'cajaId',
        filters.cajaId
      );

    }


    if (filters.usuarioId != null) {

      params = params.set(
        'usuarioId',
        filters.usuarioId
      );

    }


    if (filters.metodoPagoId != null) {

      params = params.set(
        'metodoPagoId',
        filters.metodoPagoId
      );

    }


    if (filters.estado) {

      params = params.set(
        'estado',
        filters.estado
      );

    }


    if (filters.fechaInicio) {

      params = params.set(
        'fechaInicio',
        filters.fechaInicio
      );

    }


    if (filters.fechaFin) {

      params = params.set(
        'fechaFin',
        filters.fechaFin
      );

    }


    return this.http.get<PagedResponse<SaleResponse>>(
      `${this.endpoint}/search`,
      { params }
    );

  }

}