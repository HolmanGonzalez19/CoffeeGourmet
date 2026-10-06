import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import {
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-print-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './confirm-print-dialog.component.html',
  styleUrl: './confirm-print-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmPrintDialogComponent {

  private readonly dialogRef = inject(
    MatDialogRef<ConfirmPrintDialogComponent>
  );

  cancelar(): void {
    this.dialogRef.close(false);
  }

  imprimir(): void {
    this.dialogRef.close(true);
  }
}
