import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  CurrencyPipe,
  DatePipe
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  CashRegisterService
} from '../../../../core/services/cash-register.service';

import {
  CashRegister
} from '../../../../core/models/cash-register.model';

import {
  OpenCashRegisterDialogComponent
} from '../../components/open-cash-register-dialog/open-cash-register-dialog.component';

import {
  CloseCashRegisterDialogComponent,
  CloseCashRegisterDialogData
} from '../../components/close-cash-register-dialog/close-cash-register-dialog.component';

import {
  CashMovementService
} from '../../../../core/services/cash-movement.service';

import {
  CashMovement
} from '../../../../core/models/cash-movement.model';

import {
  CashMovementDialogComponent
} from '../../components/cash-movement-dialog/cash-movement-dialog.component';


@Component({
  selector: 'app-cash-register',
  standalone: true,

  imports: [
    CurrencyPipe,
    DatePipe,
    MatButtonModule,
    MatDialogModule
  ],

  templateUrl:
    './cash-register.component.html',

  styleUrl:
    './cash-register.component.scss'
})
export class CashRegisterComponent implements OnInit {

  private readonly cashRegisterService =
    inject(CashRegisterService);

  private readonly router =
    inject(Router);

  private readonly dialog =
    inject(MatDialog);

  private readonly cashMovementService =
    inject(CashMovementService);


  // ============================================================
  // ESTADO
  // ============================================================

  movements: CashMovement[] = [];

  cashRegister: CashRegister | null = null;

  loading = true;

  errorMessage = '';


  // ============================================================
  // INICIALIZACIÓN
  // ============================================================

  ngOnInit(): void {

    this.loadCurrentCashRegister();

  }


  // ============================================================
  // CONSULTAR CAJA ACTUAL
  // ============================================================

  loadCurrentCashRegister(): void {

    this.loading = true;

    this.errorMessage = '';


    this.cashRegisterService
      .getOpen()
      .subscribe({

        next: response => {

          this.cashRegister =
            response;

          this.loadCashMovements();

          this.loading = false;

        },


        error: error => {

          console.error(
            '[CashRegister] Error:',
            error
          );

          this.cashRegister = null;

          this.movements = [];

          /*
           * 404 significa que actualmente no existe
           * una caja abierta.
           *
           * Esto no debe mostrarse como un error técnico
           * al usuario.
           */
          if (error.status === 404) {

            this.errorMessage = '';

          } else {

            this.errorMessage =
              'No fue posible consultar el estado de la caja.';

          }

          this.loading = false;

        }

      });

  }


  // ============================================================
  // ABRIR CAJA
  // ============================================================

  abrirCaja(): void {

    const dialogRef =
      this.dialog.open(
        OpenCashRegisterDialogComponent,
        {
          width: '420px',
          disableClose: true
        }
      );


    dialogRef
      .afterClosed()
      .subscribe(result => {

        if (!result) {

          return;

        }


        this.openCashRegister(
          result.montoInicial
        );

      });

  }


  // ============================================================
  // CERRAR CAJA
  // ============================================================

  cerrarCaja(): void {

    if (!this.cashRegister) {

      return;

    }


    const dialogData:
      CloseCashRegisterDialogData = {

        efectivoEsperado:
          this.cashRegister.efectivoEsperado ?? 0,

        ventasEfectivo:
          this.cashRegister.ventasEfectivo ?? 0,

        ventasTransferencia:
          this.cashRegister.ventasTransferencia ?? 0,

        ventasTotales:
          this.cashRegister.ventasTotales ?? 0

      };


    const dialogRef =
      this.dialog.open(
        CloseCashRegisterDialogComponent,
        {
          width: '480px',
          disableClose: true,
          data: dialogData
        }
      );


    dialogRef
      .afterClosed()
      .subscribe(result => {

        if (!result) {

          return;

        }


        this.closeCashRegister(
          result.efectivoContado
        );

      });

  }


  // ============================================================
  // VOLVER AL DASHBOARD
  // ============================================================

  volverAlDashboard(): void {

    this.router.navigate([
      '/dashboard'
    ]);

  }


  // ============================================================
  // EJECUTAR APERTURA
  // ============================================================

  private openCashRegister(
    montoInicial: number
  ): void {

    this.loading = true;

    this.errorMessage = '';


    this.cashRegisterService
      .open({
        montoInicial
      })
      .subscribe({

        next: response => {

          this.cashRegister =
            response;

          this.loading = false;

          this.loadCashMovements();

        },


        error: error => {

          console.error(
            '[CashRegister] Error al abrir caja:',
            error
          );

          this.loading = false;


          if (error.status === 400) {

            this.errorMessage =
              error.error?.message ??
              'Los datos de apertura no son válidos.';

            return;

          }


          if (error.status === 403) {

            this.errorMessage =
              'No posee permisos para abrir la caja.';

            return;

          }


          this.errorMessage =
            'No fue posible abrir la caja.';

        }

      });

  }


  // ============================================================
  // EJECUTAR CIERRE
  // ============================================================

  private closeCashRegister(
    efectivoContado: number
  ): void {

    if (!this.cashRegister) {

      return;

    }


    this.loading = true;

    this.errorMessage = '';


    this.cashRegisterService
      .close(
        this.cashRegister.id,
        {
          efectivoContado
        }
      )
      .subscribe({

        next: response => {

          console.log(
            '[CashRegister] Caja cerrada:',
            response
          );


          this.cashRegister =
            response;

          this.movements = [];

          this.loading = false;

        },


        error: error => {

          console.error(
            '[CashRegister] Error al cerrar caja:',
            error
          );


          this.loading = false;


          if (error.status === 400) {

            this.errorMessage =
              error.error?.message ??
              'Los datos de cierre no son válidos.';

            return;

          }


          if (error.status === 403) {

            this.errorMessage =
              'No posee permisos para cerrar la caja.';

            return;

          }


          this.errorMessage =
            'No fue posible cerrar la caja.';

        }

      });

  }


  // ============================================================
  // CONSULTAR MOVIMIENTOS DE CAJA
  // ============================================================

  loadCashMovements(): void {

    if (!this.cashRegister) {

      this.movements = [];

      return;

    }


    this.cashMovementService
      .findByCashRegister(
        this.cashRegister.id
      )
      .subscribe({

        next: (response: CashMovement[]) => {

          this.movements =
            response;

        },


        error: (error: unknown) => {

          console.error(
            '[CashRegister] Error consultando movimientos:',
            error
          );

          this.movements = [];

        }

      });

  }


  // ============================================================
  // REGISTRAR MOVIMIENTO
  // ============================================================

  registrarMovimiento(): void {

    if (!this.cashRegister) {

      return;

    }

    const dialogRef =
      this.dialog.open(
        CashMovementDialogComponent,
        {
          width: '450px',
          disableClose: true
        }
      );


    dialogRef
      .afterClosed()
      .subscribe(result => {

        if (!result) {

          return;

        }


        this.cashMovementService
          .create(
            result
          )
          .subscribe({

            next: () => {

              this.loadCurrentCashRegister();

            },


            error: error => {

              console.error(
                '[CashRegister] Error registrando movimiento:',
                error
              );

              this.errorMessage =
                error.error?.message ??
                'No fue posible registrar el movimiento.';

            }

          });

      });

  }

}