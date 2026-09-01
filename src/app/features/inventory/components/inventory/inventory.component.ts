import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { InventoryService } from '../../../../core/services/inventory.service';
import { AuthService } from '../../../../core/services/auth.service';

import {
  Inventory,
  InventoryMovement,
  CreateInventoryMovementRequest,
  InventoryReference
} from '../../../../core/models/inventory.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {

  private readonly inventoryService =
    inject(InventoryService);

  private readonly router =
    inject(Router);

  private readonly authService =
    inject(AuthService);


  // ============================================================
  // INVENTARIO
  // ============================================================

  inventario: Inventory[] = [];

  inventarioFiltrado: Inventory[] = [];


  // ============================================================
  // ESTADO GENERAL
  // ============================================================

  loading = false;

  errorMessage = '';


  // ============================================================
  // FILTROS
  // ============================================================

  filtroBusqueda = '';

  filtroEstado = 'TODOS';


  // ============================================================
  // REFERENCIAS
  // ============================================================

  referencias: InventoryReference[] = [];


  // ============================================================
  // FORMULARIO DE MOVIMIENTO
  // ============================================================

  mostrarMovimiento = false;

  guardandoMovimiento = false;

  movimientoError = '';

  productoSeleccionado: Inventory | null = null;

  movimientoForm: CreateInventoryMovementRequest = {

    productoId: 0,

    usuarioId: 0,

    tipoMovimiento: 'ENTRADA',

    cantidad: 0,

    motivo: null,

    compraId: null

  };


  // ============================================================
  // HISTORIAL DE MOVIMIENTOS
  // ============================================================

  mostrarMovimientos = false;

  cargandoMovimientos = false;

  movimientosError = '';

  movimientos: InventoryMovement[] = [];

  productoMovimientos: Inventory | null = null;


  // ============================================================
  // INICIALIZACIÓN
  // ============================================================

  ngOnInit(): void {

    this.cargarInventario();

    this.cargarReferencias();

  }


  // ============================================================
  // CARGAR INVENTARIO
  // ============================================================

  cargarInventario(): void {

    this.loading = true;

    this.errorMessage = '';

    this.inventoryService
      .getAll()
      .subscribe({

        next: (inventario: Inventory[]) => {

          this.inventario = inventario;

          this.aplicarFiltros();

          this.loading = false;

        },

        error: (error: unknown) => {

          console.error(
            'Error al cargar inventario:',
            error
          );

          this.errorMessage =
            'No fue posible cargar el inventario.';

          this.loading = false;

        }

      });

  }


  // ============================================================
  // CARGAR REFERENCIAS DE COMPRAS
  // ============================================================

  cargarReferencias(): void {

    this.inventoryService
      .getReferences()
      .subscribe({

        next: (referencias: InventoryReference[]) => {

          this.referencias = referencias;

        },

        error: (error: unknown) => {

          console.error(
            'Error al cargar referencias:',
            error
          );

        }

      });

  }


  // ============================================================
  // FILTROS
  // ============================================================

  aplicarFiltros(): void {

    const busqueda =
      this.filtroBusqueda
        .trim()
        .toLowerCase();

    this.inventarioFiltrado =
      this.inventario.filter(item => {

        // --------------------------------------------------------
        // BÚSQUEDA
        // --------------------------------------------------------

        if (busqueda) {

          const coincideBusqueda =

            item.productoNombre
              .toLowerCase()
              .includes(busqueda)

            ||

            item.productoId
              .toString()
              .includes(busqueda);

          if (!coincideBusqueda) {

            return false;

          }

        }


        // --------------------------------------------------------
        // ESTADO
        // --------------------------------------------------------

        const estado =
          this.obtenerEstado(item);

        if (
          this.filtroEstado !== 'TODOS'
          &&
          estado !== this.filtroEstado
        ) {

          return false;

        }

        return true;

      });

  }


  // ============================================================
  // ESTADO DEL INVENTARIO
  // ============================================================

  obtenerEstado(item: Inventory): string {

    if (item.cantidadActual === 0) {

      return 'AGOTADO';

    }

    if (
      item.cantidadActual <= item.stockMinimo
    ) {

      return 'BAJO';

    }

    return 'DISPONIBLE';

  }


  obtenerTextoEstado(item: Inventory): string {

    const estado =
      this.obtenerEstado(item);

    switch (estado) {

      case 'AGOTADO':

        return 'Agotado';

      case 'BAJO':

        return 'Existencias bajas';

      default:

        return 'Disponible';

    }

  }


  // ============================================================
  // LIMPIAR FILTROS
  // ============================================================

  limpiarFiltros(): void {

    this.filtroBusqueda = '';

    this.filtroEstado = 'TODOS';

    this.aplicarFiltros();

  }


  // ============================================================
  // NAVEGACIÓN
  // ============================================================

  volverAlDashboard(): void {

    this.router.navigate([
      '/dashboard'
    ]);

  }


  // ============================================================
  // VER MOVIMIENTOS
  // ============================================================

  verMovimientos(item: Inventory): void {

    this.productoMovimientos = item;

    this.mostrarMovimientos = true;

    this.cargandoMovimientos = true;

    this.movimientosError = '';

    this.movimientos = [];

    this.inventoryService
      .getMovements(item.productoId)
      .subscribe({

        next: (movimientos: InventoryMovement[]) => {

          this.movimientos = movimientos;

          this.cargandoMovimientos = false;

        },

        error: (error: unknown) => {

          console.error(
            'Error al cargar movimientos:',
            error
          );

          this.movimientosError =
            'No fue posible cargar los movimientos.';

          this.cargandoMovimientos = false;

        }

      });

  }


  // ============================================================
  // ABRIR FORMULARIO DE MOVIMIENTO
  // ============================================================

  registrarMovimiento(item: Inventory): void {

    const usuarioId =
      this.obtenerUsuarioId();

    if (!usuarioId) {

      this.errorMessage =
        'No fue posible identificar al usuario autenticado.';

      return;

    }

    this.productoSeleccionado = item;

    this.movimientoError = '';

    this.movimientoForm = {

      productoId: item.productoId,

      usuarioId: usuarioId,

      tipoMovimiento: 'ENTRADA',

      cantidad: 0,

      motivo: null,

      compraId: null

    };

    this.mostrarMovimiento = true;

  }


  // ============================================================
  // CERRAR FORMULARIO DE MOVIMIENTO
  // ============================================================

  cerrarMovimiento(): void {

    if (this.guardandoMovimiento) {

      return;

    }

    this.mostrarMovimiento = false;

    this.productoSeleccionado = null;

    this.movimientoError = '';

  }


  // ============================================================
  // OBTENER USUARIO AUTENTICADO
  // ============================================================

  private obtenerUsuarioId(): number | null {

    const usuario =
      this.authService.getCurrentUser();

    if (!usuario) {

      return null;

    }

    return usuario.usuarioId;

  }


  // ============================================================
  // GUARDAR MOVIMIENTO
  // ============================================================

  guardarMovimiento(): void {

    this.movimientoError = '';


    // ----------------------------------------------------------
    // TIPO DE MOVIMIENTO
    // ----------------------------------------------------------

    if (!this.movimientoForm.tipoMovimiento) {

      this.movimientoError =
        'Debe seleccionar el tipo de movimiento.';

      return;

    }


    // ----------------------------------------------------------
    // CANTIDAD
    // ----------------------------------------------------------

    if (
      !this.movimientoForm.cantidad
      ||
      this.movimientoForm.cantidad < 1
    ) {

      this.movimientoError =
        'La cantidad debe ser mayor que cero.';

      return;

    }


    // ----------------------------------------------------------
    // COMPRA PARA ENTRADA
    // ----------------------------------------------------------

    if (
      this.movimientoForm.tipoMovimiento === 'ENTRADA'
      &&
      !this.movimientoForm.compraId
    ) {

      this.movimientoError =
        'Debe seleccionar una compra.';

      return;

    }


    // ----------------------------------------------------------
    // GUARDAR
    // ----------------------------------------------------------

    this.guardandoMovimiento = true;

    const request: CreateInventoryMovementRequest = {

      productoId:
        this.movimientoForm.productoId,

      usuarioId:
        this.movimientoForm.usuarioId,

      tipoMovimiento:
        this.movimientoForm.tipoMovimiento,

      cantidad:
        this.movimientoForm.cantidad,

      motivo:
        this.movimientoForm.motivo?.trim()
        || null,

      compraId:
        this.movimientoForm.tipoMovimiento === 'ENTRADA'
          ? this.movimientoForm.compraId
          : null

    };


    this.inventoryService
      .createMovement(request)
      .subscribe({

        next: () => {

          this.guardandoMovimiento = false;

          this.mostrarMovimiento = false;

          this.productoSeleccionado = null;

          this.cargarInventario();

        },

        error: (error: unknown) => {

          console.error(
            'Error al registrar movimiento:',
            error
          );

          this.movimientoError =
            'No fue posible registrar el movimiento.';

          this.guardandoMovimiento = false;

        }

      });

  }


  // ============================================================
  // CERRAR HISTORIAL DE MOVIMIENTOS
  // ============================================================

  cerrarMovimientos(): void {

    this.mostrarMovimientos = false;

    this.productoMovimientos = null;

    this.movimientos = [];

    this.movimientosError = '';

  }

}