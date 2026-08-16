import {
  Component,
  Inject
} from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import {
  FormsModule
} from '@angular/forms';

import {
  CurrencyPipe
} from '@angular/common';


export interface CloseCashRegisterDialogData {

  efectivoEsperado: number;

  ventasEfectivo: number;

  ventasTransferencia: number;

  ventasTotales: number;

}


@Component({
  selector: 'app-close-cash-register-dialog',
  standalone: true,

  imports: [
    FormsModule,
    MatDialogModule,
    CurrencyPipe
  ],

  templateUrl:
    './close-cash-register-dialog.component.html',

  styleUrl:
    './close-cash-register-dialog.component.scss'
})
export class CloseCashRegisterDialogComponent {

  efectivoContado: number | null = null;


  constructor(

    private readonly dialogRef:
      MatDialogRef<CloseCashRegisterDialogComponent>,

    @Inject(MAT_DIALOG_DATA)
    readonly data: CloseCashRegisterDialogData

  ) {}


  get diferencia(): number | null {

    if (
      this.efectivoContado === null ||
      this.efectivoContado === undefined
    ) {

      return null;

    }

    return (
      Number(this.efectivoContado)
      - this.data.efectivoEsperado
    );

  }


  confirmar(): void {

    if (
      this.efectivoContado === null ||
      this.efectivoContado < 0
    ) {

      return;

    }


    this.dialogRef.close({

      efectivoContado:
        Number(this.efectivoContado)

    });

  }


  cancelar(): void {

    this.dialogRef.close();

  }

}