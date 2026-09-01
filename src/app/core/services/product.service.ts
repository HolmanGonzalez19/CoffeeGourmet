import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product } from '../models/product.model';

export interface CreateProductRequest {
  nombre: string;
  categoriaId: number;
  tipoProducto: string;
  codigoBarras: string | null;
  stockMinimo: number;
  descripcion: string | null;
  precioCompra: number;
  precioVenta: number;

}


export interface UpdateProductRequest {

  nombre: string;
  categoriaId: number;
  tipoProducto: string;
  codigoBarras: string | null;
  stockMinimo: number;
  descripcion: string | null;
  activo: boolean;
  precioCompra: number;
  precioVenta: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly http = inject(HttpClient);

  private readonly endpoint = '/api/products';


  getProducts(): Observable<Product[]> {

    return this.http.get<Product[]>(
      this.endpoint
    );

  }


  getInactiveProducts(): Observable<Product[]> {

    return this.http.get<Product[]>(
      `${this.endpoint}/inactivos`
    );

  }


  getAllProducts(): Observable<Product[]> {

    return this.http.get<Product[]>(
      `${this.endpoint}/all`
    );

  }


  getProductById(id: number): Observable<Product> {

    return this.http.get<Product>(
      `${this.endpoint}/${id}`
    );

  }


  create(
    request: CreateProductRequest
  ): Observable<Product> {

    return this.http.post<Product>(
      this.endpoint,
      request
    );

  }


  activate(id: number): Observable<void> {

    return this.http.put<void>(
      `${this.endpoint}/${id}/activate`,
      {}
    );

  }


  deactivate(id: number): Observable<void> {

    return this.http.put<void>(
      `${this.endpoint}/${id}/deactivate`,
      {}
    );

  }

  update(
  id: number,
  request: UpdateProductRequest
): Observable<Product> {

  return this.http.put<Product>(
    `${this.endpoint}/${id}`,
    request
  );

}

}