import {
  Component,
  inject
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatSelectModule
} from '@angular/material/select';

import {
  CashMovementType,
  CreateCashMovementRequest
} from '../../../../core/models/cash-movement.model';


@Component({
  selector: 'app-cash-movement-dialog',
  standalone: true,

  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],

  templateUrl:
    './cash-movement-dialog.component.html',

  styleUrl:
    './cash-movement-dialog.component.scss'
})
export class CashMovementDialogComponent {

  private readonly dialogRef =
    inject(MatDialogRef<CashMovementDialogComponent>);

  readonly data =
    inject(MAT_DIALOG_DATA);


  tipoMovimiento:
    CashMovementType =
      this.data?.tipoMovimiento ?? 'INGRESO';

  monto = 0;

  descripcion = '';


  cancelar(): void {

    this.dialogRef.close();

  }


  guardar(): void {

    if (!this.monto || this.monto <= 0) {

      return;

    }


    const request:
      CreateCashMovementRequest = {

        tipoMovimiento:
          this.tipoMovimiento,

        monto:
          this.monto,

        descripcion:
          this.descripcion?.trim() || undefined

      };


    this.dialogRef.close(request);

  }

}