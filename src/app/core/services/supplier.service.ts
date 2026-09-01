import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Supplier } from '../models/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private readonly http = inject(HttpClient);

  private readonly endpoint = '/api/suppliers';

  getAll(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(
      this.endpoint
    );

  }

  getAllInactive(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(
      `${this.endpoint}/inactive`
    );

  }

  getById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(
      `${this.endpoint}/${id}`
    );

  }

}