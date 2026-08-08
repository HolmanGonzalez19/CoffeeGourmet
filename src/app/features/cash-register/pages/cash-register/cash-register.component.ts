import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { CashRegisterService } from '../../../../core/services/cash-register.service';
import { CashRegister } from '../../../../core/models/cash-register.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OpenCashRegisterDialogComponent } from '../../components/open-cash-register-dialog/open-cash-register-dialog.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cash-register',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './cash-register.component.html',
  styleUrl: './cash-register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashRegisterComponent implements OnInit {
  private readonly cashRegisterService = inject(CashRegisterService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  cashRegister: CashRegister | null = null;

  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadCurrentCashRegister();
  }

  loadCurrentCashRegister(): void {
    this.loading = true;
    this.errorMessage = '';

    this.cashRegisterService.getCurrent().subscribe({
      next: response => {
        this.cashRegister = response;
        this.loading = false;
      },
      error: error => {
        this.loading = false;

        if (error.status === 404) {
          this.cashRegister = null;
          return;
        }

        if (error.status === 401) {
          this.errorMessage = 'La sesión ha expirado.';
          return;
        }

        if (error.status === 403) {
          this.errorMessage =
            'No posee permisos para consultar la caja.';
          return;
        }

        this.errorMessage =
          'No fue posible consultar la caja.';
      }
    });
  }

  abrirCaja(): void {
    const dialogRef = this.dialog.open(
      OpenCashRegisterDialogComponent,
      {
        width: '420px',
        disableClose: true
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.openCashRegister(result.montoInicial);
    });
  }

  volverAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  private openCashRegister(montoInicial: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.cashRegisterService
      .open({ montoInicial })
      .subscribe({
        next: response => {
          this.cashRegister = response;
          this.loading = false;
        },
        error: error => {
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
}