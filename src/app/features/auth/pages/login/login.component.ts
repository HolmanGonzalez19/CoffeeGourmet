import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

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
  MatDialogRef
} from '@angular/material/dialog';

import {
  AuthService
} from '../../../../core/services/auth.service';

import {
  OperatorStateService
} from '../../../../core/services/operator-state.service';

import {
  NotificationService
} from '../../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],

  templateUrl:
    './login.component.html',

  styleUrl:
    './login.component.scss',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  private readonly authService =
    inject(AuthService);

  private readonly operatorStateService =
    inject(OperatorStateService);

  private readonly router =
    inject(Router);

  private readonly dialogRef =
    inject(MatDialogRef<LoginComponent>);

  private readonly cdr =
    inject(ChangeDetectorRef);

  private readonly notificationService =
    inject(NotificationService);


  usuario = '';

  password = '';

  loading = false;

  errorMessage = '';


  // ============================================================
  // LOGIN ADMINISTRADOR
  // ============================================================

  login(): void {

    /*
     * Un operador activo debe finalizar su jornada
     * antes de permitir el acceso administrativo.
     */
    if (
      this.operatorStateService.isOperatorActive()
    ) {

      this.errorMessage =
        'Debe finalizar la jornada del operador antes de iniciar sesión como administrador.';

      return;
    }

    if (
      !this.usuario.trim() ||
      !this.password
    ) {

      /*this.errorMessage =
        'Ingrese usuario y contraseña.';*/

      this.notificationService.warning(
        'Ingrese usuario y contraseña.'
      );

      return;
    }

    if (this.loading) {

      return;
    }

    this.loading = true;

    this.errorMessage = '';

    this.authService.login({

      usuario:
        this.usuario.trim(),

      password:
        this.password

    }).subscribe({

      next: response => {

        try {

          this.authService.saveSession(
            response
          );

          this.loading = false;

          this.dialogRef.close(true);

          this.notificationService.success(
            'Sesión iniciada correctamente.'
          );

          this.router.navigate([
            '/dashboard'
          ]);

        } catch (error) {

          console.error(
            '[Login] Error al guardar sesión:',
            error
          );

          this.loading = false;
          this.notificationService.error(
            'No se pudo iniciar la sesión administrativa.'
          );

          this.cdr.markForCheck();
        }

      },

      error: error => {

        this.loading = false;

        console.error(
          '[Login] Error:',
          error
        );

        if (error?.error?.message) {

          this.notificationService.error(
            error.error.message
          );

        } else {

          this.notificationService.error(
            'No fue posible iniciar sesión.'
          );

        }

        this.cdr.markForCheck();
      }

    });
  }

  // ============================================================
  // CANCELAR
  // ============================================================

  cancelar(): void {

    if (this.loading) {

      return;

    }

    this.dialogRef.close(false);

  }


  // ============================================================
  // CERRAR MODAL
  // ============================================================

  cerrar(): void {

    this.cancelar();

  }

}