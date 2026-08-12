import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

import { OperatorService } from '../../../../core/services/operator.service';
import { Operator } from '../../../../core/models/operator.model';

import {
  OperatorStateService
} from '../../../../core/services/operator-state.service';

import {
  AuthService,
  AuthenticationResponse
} from '../../../../core/services/auth.service';

@Component({
  selector: 'app-operator-selection',
  standalone: true,
  imports: [
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './operator-selection.component.html',
  styleUrl: './operator-selection.component.scss'
})
export class OperatorSelectionComponent implements OnInit {

  private readonly operatorService =
    inject(OperatorService);

  private readonly authService =
    inject(AuthService);

  private readonly operatorStateService =
    inject(OperatorStateService);

  private readonly router =
    inject(Router);

  // ============================================================
  // OPERADORES
  // ============================================================

  operators: Operator[] = [];

  selectedOperator: Operator | null = null;

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

  pinErrorMessage = '';

  // ============================================================
  // INICIALIZACIÓN
  // ============================================================

  ngOnInit(): void {
    this.loadOperators();
  }

  // ============================================================
  // CONSULTAR OPERADORES
  // ============================================================

  loadOperators(): void {

    this.loading = true;
    this.errorMessage = '';

    this.operatorService.getOperators().subscribe({

      next: operators => {

        this.operators = operators;

        this.loading = false;

        console.log(
          '[OperatorSelection] Operadores:',
          operators
        );
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

  selectOperator(operator: Operator): void {

    this.selectedOperator = operator;

    this.pin = '';

    this.pinErrorMessage = '';

    this.showPin = true;

    console.log(
      '[OperatorSelection] Operador seleccionado:',
      operator
    );
  }

  // ============================================================
  // AUTENTICAR OPERADOR
  // ============================================================

  continue(): void {

    if (!this.selectedOperator) {
      return;
    }

    if (!this.pin.trim()) {

      this.pinErrorMessage =
        'Ingrese el PIN del operador.';

      return;
    }

    if (this.authenticating) {
      return;
    }

    this.authenticating = true;

    this.pinErrorMessage = '';

    const request = {
      usuario: this.selectedOperator.usuario,
      pin: this.pin
    };

    console.log(
      '[OperatorSelection] Autenticando operador:',
      this.selectedOperator.usuario
    );

    this.authService.loginWithPin(request).subscribe({

      next: (response: AuthenticationResponse) => {

        console.log(
          '[OperatorSelection] Autenticación exitosa:',
          response
        );

        this.createOperatorSession(response);

        this.authenticating = false;

        this.router.navigate(['/']);
      },

      error: error => {

        console.error(
          '[OperatorSelection] Error de autenticación:',
          error
        );

        this.authenticating = false;

        this.pinErrorMessage =
          error?.error?.message ??
          'PIN incorrecto o usuario sin permiso para operar caja.';
      }
    });
  }

  // ============================================================
  // CREAR SESIÓN DEL OPERADOR
  // ============================================================

  private createOperatorSession(
    response: AuthenticationResponse
  ): void {

    this.operatorStateService.setOperator({

      usuarioId: response.usuarioId,

      nombre: response.nombre,

      usuario: response.usuario,

      rolId: response.rolId,

      rolNombre: response.rolNombre,

      token: response.token,

      permisos: response.permisos
    });

    console.log(
      '[OperatorSelection] Sesión de operador creada:',
      this.operatorStateService.currentOperator()
    );
  }
}