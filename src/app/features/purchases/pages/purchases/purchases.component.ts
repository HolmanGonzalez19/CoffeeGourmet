import {
  Component,
  OnInit,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { PurchaseService } from '../../../../core/services/purchase.service';
import { Purchase } from '../../../../core/models/purchase.model';


@Component({
  selector: 'app-purchases',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.scss'
})
export class PurchasesComponent implements OnInit {

  private readonly purchaseService =
    inject(PurchaseService);

  private readonly router =
    inject(Router);


  compras: Purchase[] = [];

  comprasFiltradas: Purchase[] = [];


  loading = false;

  errorMessage = '';


  filtroBusqueda = '';

  filtroEstado =
    'TODOS';


  ngOnInit(): void {

    this.cargarCompras();

  }


  cargarCompras(): void {

    this.loading = true;

    this.errorMessage = '';


    this.purchaseService
      .getAll()
      .subscribe({

        next: (compras) => {

          this.compras = compras;

          this.aplicarFiltros();

          this.loading = false;

        },

        error: (error: unknown) => {

          console.error(
            'Error al cargar compras:',
            error
          );

          this.errorMessage =
            'No fue posible cargar las compras.';

          this.loading = false;

        }

      });

  }


  aplicarFiltros(): void {

    const busqueda =
      this.filtroBusqueda
        .trim()
        .toLowerCase();


    this.comprasFiltradas =
      this.compras.filter(compra => {

        if (busqueda) {

          const coincide =

            compra.codigoCompra
              .toLowerCase()
              .includes(busqueda)

            ||

            compra.proveedorNombre
              .toLowerCase()
              .includes(busqueda);


          if (!coincide) {

            return false;

          }

        }


        if (
          this.filtroEstado !== 'TODOS'
          &&
          compra.estado !== this.filtroEstado
        ) {

          return false;

        }


        return true;

      });

  }


  limpiarFiltros(): void {

    this.filtroBusqueda = '';

    this.filtroEstado = 'TODOS';

    this.aplicarFiltros();

  }


  obtenerTextoEstado(
    estado: Purchase['estado']
  ): string {

    switch (estado) {

      case 'REGISTRADA':
        return 'Registrada';

      case 'ANULADA':
        return 'Anulada';

      default:
        return estado;

    }

  }


  verDetalle(
    compra: Purchase
  ): void {

    this.router.navigate([
      '/purchases',
      compra.id
    ]);

  }


  registrarCompra(): void {

    this.router.navigate([
      '/purchases/new'
    ]);

  }


  volverAlDashboard(): void {

    this.router.navigate([
      '/dashboard'
    ]);

  }

}