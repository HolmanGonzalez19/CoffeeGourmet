import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  FormsModule
} from '@angular/forms';

import {
  OperatorService
} from '../../../../core/services/operator.service';

import {
  Operator
} from '../../../../core/models/operator.model';

import {
  OperatorStateService
} from '../../../../core/services/operator-state.service';

import {
  AuthService,
  AuthenticationResponse
} from '../../../../core/services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../core/services/notification.service';


@Component({
  selector: 'app-operator-selection',
  standalone: true,

  imports: [
    MatButtonModule,
    CommonModule,
    FormsModule,
    MatIconModule
  ],

  templateUrl:
    './operator-selection.component.html',

  styleUrl:
    './operator-selection.component.scss'
})
export class OperatorSelectionComponent
  implements OnInit {


  private readonly operatorService =
    inject(OperatorService);

  private readonly authService =
    inject(AuthService);

  private readonly operatorStateService =
    inject(OperatorStateService);

  private readonly router =
    inject(Router);

  private readonly dialogRef =
    inject(MatDialogRef<OperatorSelectionComponent>);

  private readonly notificationService =
      inject(NotificationService);


  // ============================================================
  // OPERADORES
  // ============================================================

  operators: Operator[] = [];

  selectedOperator:
    Operator | null = null;


  // ============================================================
  // PIN
  // ============================================================

  pin = '';

  showPin = false;


  // ============================================================
  // ESTADO
  // ============================================================

  loading = true;

  authenticating = false;

  errorMessage = '';



  // ============================================================
  // INICIALIZACIÓN
  // ============================================================

  ngOnInit(): void {

    /*
     * Si existe una sesión administrativa,
     * no permitimos iniciar una jornada de operador.
     */
    if (
      this.authService.isAdminSessionActive()
    ) {

      this.loading = false;

      this.errorMessage =
        'Debe cerrar la sesión administrativa antes de iniciar una jornada como operador.';

      return;

    }


    /*
     * Si ya existe un operador activo,
     * no necesitamos iniciar otra jornada.
     */
    if (
      this.operatorStateService.isOperatorActive()
    ) {

      this.loading = false;

      this.errorMessage =
        'Ya existe un operador activo.';

      return;

    }


    this.loadOperators();

  }


  // ============================================================
  // CONSULTAR OPERADORES
  // ============================================================

  loadOperators(): void {

    this.loading = true;

    this.errorMessage = '';


    this.operatorService
      .getOperators()
      .subscribe({

        next: operators => {

          this.operators =
            operators;

          this.loading = false;

        },


        error: error => {

          console.error(
            '[OperatorSelection] Error al consultar operadores:',
            error
          );

          this.operators = [];

          this.loading = false;

          this.errorMessage =
            'No fue posible consultar los operadores.';

        }

      });

  }


  // ============================================================
  // SELECCIONAR OPERADOR
  // ============================================================

  selectOperator(
    operator: Operator
  ): void {

    this.selectedOperator =
      operator;

    this.pin = '';


    this.showPin = true;

  }


  // ============================================================
  // AUTENTICAR OPERADOR
  // ============================================================

  continue(): void {

    if (
      !this.selectedOperator
    ) {

      return;

    }


    /*
     * Validación exacta:
     * PIN de cuatro dígitos numéricos.
     */
    if (
      !/^\d{4}$/.test(this.pin)
    ) {

      this.notificationService.info(
        'El PIN debe contener exactamente 4 dígitos numéricos.'
      );

      return;

    }


    if (
      this.authenticating
    ) {

      return;

    }


    /*
     * Segunda protección:
     * no permitir operador si apareció una
     * sesión administrativa durante el proceso.
     */
    if (
      this.authService.isAdminSessionActive()
    ) {

      this.notificationService.info(
        'Debe cerrar la sesión administrativa antes de iniciar una jornada como operador.'
      );

      return;

    }


    this.authenticating = true;



    const request = {

      usuario:
        this.selectedOperator.usuario,

      pin:
        this.pin

    };


    this.authService
      .loginWithPin(request)
      .subscribe({

        next:
          (
            response:
              AuthenticationResponse
          ) => {

            this.createOperatorSession(
              response
            );

            this.authenticating =
              false;

            this.dialogRef.close(true);

          },


        error: error => {

          console.error(
            '[OperatorSelection] Error de autenticación:',
            error
          );

          this.authenticating =
            false;

          this.notificationService.error(
            error?.error?.message ??
            'PIN incorrecto o usuario sin permiso para operar.'
          );

        }

      });

  }


  // ============================================================
  // CREAR SESIÓN DEL OPERADOR
  // ============================================================

  private createOperatorSession(
    response:
      AuthenticationResponse
  ): void {

    this.operatorStateService
      .setOperator({

        usuarioId:
          response.usuarioId,

        nombre:
          response.nombre,

        usuario:
          response.usuario,

        rolId:
          response.rolId,

        rolNombre:
          response.rolNombre,

        token:
          response.token,

        permisos:
          response.permisos

      });

  }

  clearSelection(): void {
  this.selectedOperator = null;
  this.showPin = false;
  this.pin = '';
}

handleKeyPress(key: string): void {
  if (key === 'C') {
    this.pin = '';
    return;
  }

  if (key === 'clear') {
    this.pin = this.pin.slice(0, -1);
    return;
  }

  // Solo permitir números
  if (!/^\d$/.test(key)) {
    return;
  }

  // Limitar a 4 dígitos
  if (this.pin.length >= 4) {
    return;
  }

  this.pin += key;

  // Validar automáticamente cuando se completan los 4 dígitos
  if (this.pin.length === 4) {
    this.continue();
  }
}

cerrarModal(): void {
    this.dialogRef.close(false); // false = usuario canceló
  }

}