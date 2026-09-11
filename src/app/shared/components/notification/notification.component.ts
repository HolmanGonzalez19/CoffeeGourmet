import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

export interface NotificationData {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent {

  readonly data = inject<NotificationData>(MAT_SNACK_BAR_DATA);
  private readonly snackBarRef = inject(MatSnackBarRef<NotificationComponent>);

  get icon(): string {
    switch (this.data.type) {
      case 'success':
        return 'check_circle';

      case 'error':
        return 'error';

      case 'warning':
        return 'warning';

      case 'info':
        return 'info';

      default:
        return 'info';
    }
  }

  cerrar(): void {
    this.snackBarRef.dismiss();
  }
}