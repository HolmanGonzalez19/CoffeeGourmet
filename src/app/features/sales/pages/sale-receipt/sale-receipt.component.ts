import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SaleResponse } from '../../../../core/models/sale.model';

@Component({
  selector: 'app-sale-receipt',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './sale-receipt.component.html',
  styleUrl: './sale-receipt.component.scss'
})
export class SaleReceiptComponent {

  @Input({ required: true })
  sale!: SaleResponse;

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);

    return date.toLocaleString('es-CO', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  }

  formatearPrecio(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(valor);
  }
}

/*import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SaleResponse } from '../../../../core/models/sale.model';

@Component({
  selector: 'app-sale-receipt-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './sale-receipt-dialog.component.html',
  styleUrl: './sale-receipt-dialog.component.scss'
})
export class SaleReceiptDialogComponent {

  @Input() sale!: SaleResponse;

  private readonly dialogRef =
    inject(MatDialogRef<SaleReceiptDialogComponent>);

  readonly sale =
    inject<SaleResponse>(MAT_DIALOG_DATA);

  cerrar(): void {
    this.dialogRef.close();
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);

    return date.toLocaleString('es-CO', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  }

  formatearPrecio(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(valor);
  }

  imprimir(): void {
    window.print();
  }
}*/