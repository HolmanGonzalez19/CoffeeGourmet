import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Inventory,
  InventoryMovement,
  CreateInventoryMovementRequest,
  InventoryReference
} from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private readonly http = inject(HttpClient);

  private readonly endpoint = '/api/inventory';


  // ============================================================
  // INVENTARIO
  // ============================================================

  getAll(): Observable<Inventory[]> {

    return this.http.get<Inventory[]>(
      this.endpoint
    );

  }


  getByProduct(
    productId: number
  ): Observable<Inventory> {

    return this.http.get<Inventory>(
      `${this.endpoint}/product/${productId}`
    );

  }


  // ============================================================
  // MOVIMIENTOS
  // ============================================================

  getMovements(
    productId: number
  ): Observable<InventoryMovement[]> {

    return this.http.get<InventoryMovement[]>(
      `${this.endpoint}/product/${productId}/movements`
    );

  }


  // ============================================================
  // REGISTRAR MOVIMIENTO
  // ============================================================

  createMovement(
    request: CreateInventoryMovementRequest
  ): Observable<InventoryMovement> {

    return this.http.post<InventoryMovement>(
      `${this.endpoint}/movements`,
      request
    );

  }

  // ============================================================
  // OBTENER REFERENCIAS
  // ============================================================

  getReferences(): Observable<InventoryReference[]> {

  return this.http.get<InventoryReference[]>(
    `${this.endpoint}/references`
  );

}

}