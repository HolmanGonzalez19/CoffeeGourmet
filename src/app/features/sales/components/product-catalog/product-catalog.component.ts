import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  inject
} from '@angular/core';

import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-product-catalog',
  standalone: true,

  imports: [
    FormsModule,
    CurrencyPipe
  ],

  templateUrl: './product-catalog.component.html',

  styleUrl: './product-catalog.component.scss',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCatalogComponent implements OnInit {

  private readonly productService =
    inject(ProductService);

  private readonly changeDetectorRef =
    inject(ChangeDetectorRef);


  @Output()
  productSelected =
    new EventEmitter<Product>();


  products: Product[] = [];

  filteredProducts: Product[] = [];

  searchTerm = '';

  loading = false;

  errorMessage = '';


  // ============================================================
  // INICIALIZACIÓN
  // ============================================================

  ngOnInit(): void {

    this.loadProducts();

  }


  // ============================================================
  // CONSULTAR PRODUCTOS
  // ============================================================

  loadProducts(): void {

    this.loading = true;

    this.errorMessage = '';


    this.productService
      .getProducts()
      .subscribe({

        next: products => {

          console.log(
            '[ProductCatalog] Productos recibidos:',
            products
          );


          this.products =
            products;

          this.filteredProducts =
            [...products];

          this.loading =
            false;


          this.changeDetectorRef
            .markForCheck();

        },


        error: error => {

          console.error(
            '[ProductCatalog] Error:',
            error
          );


          this.loading =
            false;

          this.errorMessage =
            'No fue posible consultar los productos.';


          this.changeDetectorRef
            .markForCheck();

        }

      });

  }


  // ============================================================
  // BUSCAR PRODUCTOS
  // ============================================================

  onSearch(): void {

    const term =
      this.searchTerm
        .trim()
        .toLowerCase();


    if (!term) {

      this.errorMessage = '';
      this.filteredProducts =
        [...this.products];

      this.changeDetectorRef
        .markForCheck();

      return;

    }

this.errorMessage = '';
    this.filteredProducts =
      this.products.filter(product =>

        product.codigo
          .toLowerCase()
          .includes(term)

        ||

        product.nombre
          .toLowerCase()
          .includes(term)

      );


    this.changeDetectorRef
      .markForCheck();

  }


  // ============================================================
  // SELECCIONAR PRODUCTO
  // ============================================================

  selectProduct(
    product: Product
  ): void {

    console.log(
      '[ProductCatalog] Producto seleccionado:',
      product
    );


    this.productSelected.emit(
      product
    );

  }

// ============================================================
  // SCANEAR PRODUCTO
  // ============================================================

showScannedProduct(product: Product): void {
  this.searchTerm = product.codigoBarras ?? '';
  this.filteredProducts = [product];
  this.errorMessage = '';

  this.changeDetectorRef.markForCheck();
}

/*onBarcodeScan(event: Event): void {
  const input = event.target as HTMLInputElement;

  const codigoBarras = input.value.trim();

  if (!codigoBarras) {
    return;
  }

  this.productService
    .getProductByBarcode(codigoBarras)
    .subscribe({
      next: product => {

        if (!product.activo) {
          this.errorMessage =
            'El producto asociado al código de barras está inactivo.';

          this.changeDetectorRef.markForCheck();
          return;
        }

        // Mantener el código escaneado en el buscador
        this.searchTerm =
          product.codigoBarras ?? '';

        // Mostrar únicamente el producto encontrado
        this.filteredProducts = [product];

        // Limpiar cualquier mensaje anterior
        this.errorMessage = '';

        // Enviar el producto al POS
        this.productSelected.emit(product);

        this.changeDetectorRef.markForCheck();
      },

      error: error => {

        console.error(
          '[ProductCatalog] Producto no encontrado por código de barras:',
          error
        );

        this.errorMessage =
          'No existe un producto asociado a este código de barras.';

        // No modificar filteredProducts aquí.
        // El mensaje se mantiene hasta que el usuario
        // borre o cambie la búsqueda.

        this.changeDetectorRef.markForCheck();
      }
    });
}*/

}