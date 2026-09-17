import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  CreateSupplierRequest,
  GetSuppliers,
  Supplier,
  UpdateSupplierRequest
} from '../models/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private readonly http = inject(HttpClient);

  private readonly endpoint = '/api/suppliers';

// ============================================================
  // OBTENER TODOS LOS PROVEEDORES
  // GET /api/suppliers
  // ============================================================

  getAllSuppliers(): Observable<GetSuppliers[]> {

    return this.http.get<GetSuppliers[]>(
      `${this.endpoint}/all`
    );

  }

  // ============================================================
  // OBTENER PROVEEDORES ACTIVOS
  // GET /api/suppliers
  // ============================================================

  getAll(): Observable<GetSuppliers[]> {

    return this.http.get<GetSuppliers[]>(
      this.endpoint
    );

  }


  // ============================================================
  // OBTENER PROVEEDORES INACTIVOS
  // GET /api/suppliers/inactive
  // ============================================================

  getInactiveSuppliers(): Observable<GetSuppliers[]> {

    return this.http.get<GetSuppliers[]>(
      `${this.endpoint}/inactivos`
    );

  }


  // ============================================================
  // OBTENER PROVEEDOR POR ID
  // GET /api/suppliers/{id}
  // ============================================================

  getById(id: number): Observable<GetSuppliers> {

    return this.http.get<GetSuppliers>(
      `${this.endpoint}/${id}`
    );

  }


  // ============================================================
  // CREAR PROVEEDOR
  // POST /api/suppliers
  // ============================================================

  create(
    request: CreateSupplierRequest
  ): Observable<Supplier> {

    return this.http.post<Supplier>(
      this.endpoint,
      request
    );

  }


  // ============================================================
  // ACTUALIZAR PROVEEDOR
  // PUT /api/suppliers/{id}
  // ============================================================

  update(
    id: number,
    request: UpdateSupplierRequest
  ): Observable<Supplier> {

    return this.http.put<Supplier>(
      `${this.endpoint}/${id}`,
      request
    );

  }


  // ============================================================
  // ACTIVAR PROVEEDOR
  // PUT /api/suppliers/{id}/activate
  // ============================================================

  activate(id: number): Observable<void> {

    return this.http.put<void>(
      `${this.endpoint}/${id}/activate`,
      {}
    );

  }


  // ============================================================
  // DESACTIVAR PROVEEDOR
  // PUT /api/suppliers/{id}/deactivate
  // ============================================================

  deactivate(id: number): Observable<void> {

    return this.http.put<void>(
      `${this.endpoint}/${id}/deactivate`,
      {}
    );

  }

}
