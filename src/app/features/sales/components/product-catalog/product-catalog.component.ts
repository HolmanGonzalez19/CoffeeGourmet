import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../products/services/product.service';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './product-catalog.component.html',
  styleUrl: './product-catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCatalogComponent implements OnInit {
  private readonly productService = inject(ProductService);

  products: Product[] = [];
  loading = false;
  error = false;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = false;

    this.productService.getProducts().subscribe({
      next: products => {
        this.products = products;
        this.loading = false;
      },
      error: error => {
        console.error('Error al consultar productos:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  selectProduct(product: Product): void {
    console.log('Producto seleccionado:', product);
  }

  retry(): void {
    this.loadProducts();
  }
}