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

import { ProductService } from '../../../../core/services/product.service';
import { ProductPos } from '../../../../core/models/pos.model';

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
    new EventEmitter<ProductPos>();


  products: ProductPos[] = [];

  filteredProducts: ProductPos[] = [];

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
      .getProductsForPos()
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
    product: ProductPos
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

showScannedProduct(product: ProductPos): void {
  this.searchTerm = product.codigoBarras ?? '';
  this.filteredProducts = [product];
  this.errorMessage = '';

  this.changeDetectorRef.markForCheck();
}

obtenerUrlImagen(imagen: string): string {
  return `/api/products/images/${encodeURIComponent(imagen)}`;
}

}