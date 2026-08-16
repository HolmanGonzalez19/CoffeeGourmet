import {
  ChangeDetectionStrategy,
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
  AuthService
} from '../../../../core/services/auth.service';

import {
  OperatorStateService
} from '../../../../core/services/operator-state.service';


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

      this.errorMessage =
        'Ingrese usuario y contraseña.';

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

          this.router.navigate([
            '/dashboard'
          ]);

        } catch (error) {

          console.error(
            '[Login] Error al guardar sesión:',
            error
          );

          this.loading = false;

          this.errorMessage =
            'No se puede iniciar sesión administrativa mientras existe un operador activo.';

        }

      },


      error: error => {

        this.loading = false;


        if (error.status === 401) {

          this.errorMessage =
            'Usuario o contraseña incorrectos.';

          return;

        }


        if (error.status === 403) {

          this.errorMessage =
            'El usuario no tiene permisos para acceder.';

          return;

        }


        this.errorMessage =
          'No fue posible iniciar sesión.';

      }

    });

  }


  // ============================================================
  // VOLVER AL POS
  // ============================================================

  volverAlPos(): void {

    this.router.navigate([
      '/'
    ]);

  }

}