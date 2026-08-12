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

      this.filteredProducts =
        [...this.products];

      this.changeDetectorRef
        .markForCheck();

      return;

    }


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

}