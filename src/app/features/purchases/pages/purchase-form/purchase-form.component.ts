import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  PurchaseService
} from '../../../../core/services/purchase.service';

import {
  CreatePurchaseRequest
} from '../../../../core/models/purchase.model';

import {
  ProductService
} from '../../../../core/services/product.service';

import {
  Product
} from '../../../../core/models/product.model';
import { SupplierService } from '../../../../core/services/supplier.service';
import { Supplier } from '../../../../core/models/supplier.model';


interface PurchaseDetailForm {

  productoId: number | null;

  cantidad: number;

  precioCompra: number;

}


@Component({
  selector: 'app-purchase-form',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './purchase-form.component.html',

  styleUrl: './purchase-form.component.scss'
})
export class PurchaseFormComponent implements OnInit {

  private readonly purchaseService =
    inject(PurchaseService);

  private readonly productService =
    inject(ProductService);

  private readonly supplierService =
    inject(SupplierService);

  private readonly router =
    inject(Router);


  proveedores: Supplier[] = [];

  productos: Product[] = [];


  proveedorId: number | null = null;

  usuarioId = 1;

  observacion = '';


  detalles: PurchaseDetailForm[] = [];


  loading = false;

  loadingCatalogos = false;

  errorMessage = '';

  successMessage = '';


  ngOnInit(): void {

    this.cargarCatalogos();

    this.agregarDetalle();

  }


  cargarCatalogos(): void {

    this.loadingCatalogos = true;

    this.errorMessage = '';


    this.supplierService
      .getAll()
      .subscribe({

        next: (proveedores: Supplier[]) => {

          this.proveedores = proveedores;

          this.cargarProductos();

        },

        error: (error: unknown) => {

          console.error(
            'Error al cargar proveedores:',
            error
          );

          this.errorMessage =
            'No fue posible cargar los proveedores.';

          this.loadingCatalogos = false;

        }

      });

  }


  cargarProductos(): void {

    this.productService
      .getProducts()
      .subscribe({

        next: (productos: Product[]) => {

          this.productos = productos;

          this.loadingCatalogos = false;

        },

        error: (error: unknown) => {

          console.error(
            'Error al cargar productos:',
            error
          );

          this.errorMessage =
            'No fue posible cargar los productos.';

          this.loadingCatalogos = false;

        }

      });

  }


  agregarDetalle(): void {

    this.detalles.push({

      productoId: null,

      cantidad: 1,

      precioCompra: 0

    });

  }


  eliminarDetalle(index: number): void {

    if (this.detalles.length === 1) {

      return;

    }

    this.detalles.splice(index, 1);

  }


  obtenerSubtotal(
    detalle: PurchaseDetailForm
  ): number {

    return detalle.cantidad *
      detalle.precioCompra;

  }


  obtenerTotal(): number {

    return this.detalles.reduce(

      (total: number, detalle: PurchaseDetailForm) =>
        total +
        this.obtenerSubtotal(detalle),

      0

    );

  }


  guardar(): void {

    this.errorMessage = '';

    this.successMessage = '';


    if (!this.proveedorId) {

      this.errorMessage =
        'Debe seleccionar un proveedor.';

      return;

    }

    if (!this.detalles.length) {

      this.errorMessage =
        'Debe agregar al menos un producto.';

      return;

    }


    for (const detalle of this.detalles) {

      if (!detalle.productoId) {

        this.errorMessage =
          'Todos los detalles deben tener un producto.';

        return;

      }


      if (detalle.cantidad <= 0) {

        this.errorMessage =
          'La cantidad debe ser mayor que cero.';

        return;

      }


      if (detalle.precioCompra <= 0) {

        this.errorMessage =
          'El precio de compra debe ser mayor que cero.';

        return;

      }

    }


    const request: CreatePurchaseRequest = {

      proveedorId: this.proveedorId,

      usuarioId: this.usuarioId,

      observacion:
        this.observacion.trim()
          ? this.observacion.trim()
          : null,

      detalles:
        this.detalles.map((detalle: PurchaseDetailForm) => ({

          productoId:
            detalle.productoId!,

          cantidad:
            detalle.cantidad,

          precioCompra:
            detalle.precioCompra

        }))

    };


    this.loading = true;


    this.purchaseService
      .create(request)
      .subscribe({

        next: (compra) => {

          this.loading = false;

          this.router.navigate([
            '/purchases',
            compra.id
          ]);

        },

        error: (error: unknown) => {

          console.error(
            'Error al registrar compra:',
            error
          );

          this.errorMessage =
            'No fue posible registrar la compra.';

          this.loading = false;

        }

      });

  }


  cancelar(): void {

    this.router.navigate([
      '/purchases'
    ]);

  }

}