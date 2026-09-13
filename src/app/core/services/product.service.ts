import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CreateProductRequest, Product, ProductTypes, UpdateProductRequest } from '../models/product.model';


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

  update(id: number, request: UpdateProductRequest
): Observable<Product> {

  return this.http.put<Product>(
    `${this.endpoint}/${id}`,
    request
  );

}

getProductByBarcode(codigoBarras: string): Observable<Product> {
  return this.http.get<Product>(
    `${this.endpoint}/barcode/${encodeURIComponent(codigoBarras)}`
  );
}

getProductTypes(): Observable<ProductTypes[]> {
  return this.http.get<ProductTypes[]>(
    `${this.endpoint}/product-types`
  );
}

}