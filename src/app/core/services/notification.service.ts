import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.show(message, 'success', 3000);
  }

  error(message: string): void {
    this.show(message, 'error', 4000);
  }

  warning(message: string): void {
    this.show(message, 'warning', 3500);
  }

  info(message: string): void {
    this.show(message, 'info', 3000);
  }

  private show(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info',
    duration: number
  ): void {

    this.snackBar.dismiss();

    this.snackBar.open(message, 'X', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    });
  }
}