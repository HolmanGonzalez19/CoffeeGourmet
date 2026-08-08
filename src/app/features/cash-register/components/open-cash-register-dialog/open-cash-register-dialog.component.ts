import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-open-cash-register-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './open-cash-register-dialog.component.html',
  styleUrl: './open-cash-register-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenCashRegisterDialogComponent {
  private readonly dialogRef = inject(
    MatDialogRef<OpenCashRegisterDialogComponent>
  );

  readonly data = inject(MAT_DIALOG_DATA);

  montoInicial: number | null = null;
  errorMessage = '';

  confirmar(): void {
    if (
      this.montoInicial === null ||
      this.montoInicial < 0
    ) {
      this.errorMessage =
        'Ingrese un monto inicial válido.';
      return;
    }

    this.dialogRef.close({
      montoInicial: this.montoInicial
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}