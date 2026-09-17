import {
  Component,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { PurchaseService } from '../../../../core/services/purchase.service';
import { Purchase } from '../../../../core/models/purchase.model';

import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';


@Component({
  selector: 'app-purchases',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule
  ],

  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.scss'
})
export class PurchasesComponent implements OnInit {

  private readonly purchaseService =
    inject(PurchaseService);

  private readonly router =
    inject(Router);


  // ==========================================================
  // COMPRAS
  // ==========================================================

  compras: Purchase[] = [];

  comprasFiltradas: Purchase[] = [];

  comprasPaginadas: Purchase[] = [];


  // ==========================================================
  // PAGINADOR
  // ==========================================================

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  paginaActual = 0;

  registrosPorPagina = 10;

  totalRegistros = 0;


  // ==========================================================
  // ESTADO
  // ==========================================================

  loading = false;

  errorMessage = '';


  // ==========================================================
  // FILTROS
  // ==========================================================

  filtroBusqueda = '';

  filtroEstado =
    'TODOS';


  // ==========================================================
  // INIT
  // ==========================================================

  ngOnInit(): void {

    this.cargarCompras();

  }


  // ==========================================================
  // CARGAR COMPRAS
  // ==========================================================

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


  // ==========================================================
  // FILTROS
  // ==========================================================

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


    // ========================================================
    // REINICIAR PAGINACIÓN
    // ========================================================

    this.paginaActual = 0;

    this.totalRegistros =
      this.comprasFiltradas.length;

    this.actualizarComprasPaginadas();

  }


  // ==========================================================
  // ACTUALIZAR COMPRAS PAGINADAS
  // ==========================================================

  private actualizarComprasPaginadas(): void {

    const inicio =
      this.paginaActual *
      this.registrosPorPagina;

    const fin =
      inicio +
      this.registrosPorPagina;


    this.comprasPaginadas =
      this.comprasFiltradas.slice(
        inicio,
        fin
      );

  }


  // ==========================================================
  // EVENTO DEL PAGINADOR
  // ==========================================================

  handlePageEvent(
    event: PageEvent
  ): void {

    this.paginaActual =
      event.pageIndex;

    this.registrosPorPagina =
      event.pageSize;

    this.actualizarComprasPaginadas();

  }


  // ==========================================================
  // TOTAL DE PÁGINAS
  // ==========================================================

  obtenerTotalPaginas(): number {

    if (this.totalRegistros === 0) {

      return 1;

    }


    return Math.ceil(
      this.totalRegistros /
      this.registrosPorPagina
    );

  }


  // ==========================================================
  // LIMPIAR FILTROS
  // ==========================================================

  limpiarFiltros(): void {

    this.filtroBusqueda = '';

    this.filtroEstado = 'TODOS';

    this.aplicarFiltros();

  }


  // ==========================================================
  // ESTADO
  // ==========================================================

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


  // ==========================================================
  // DETALLE
  // ==========================================================

  verDetalle(
    compra: Purchase
  ): void {

    this.router.navigate([
      'admin/purchases',
      compra.id
    ]);

  }


  // ==========================================================
  // REGISTRAR COMPRA
  // ==========================================================

  registrarCompra(): void {

    this.router.navigate([
      'admin/purchases/new'
    ]);

  }


  // ==========================================================
  // DASHBOARD
  // ==========================================================

  volverAlDashboard(): void {

    this.router.navigate([
      'admin/dashboard'
    ]);

  }

}