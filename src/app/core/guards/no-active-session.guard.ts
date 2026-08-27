import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService } from '../services/auth.service';

import {
  OperatorStateService
} from '../services/operator-state.service';


export const noActiveSessionGuard:
  CanActivateFn = () => {

  const authService =
    inject(AuthService);

  const operatorStateService =
    inject(OperatorStateService);

  const router =
    inject(Router);


  /*
   * Administrador activo:
   * debe permanecer en administración
   * hasta cerrar sesión.
   */
  if (
    authService.isAdminSessionActive()
  ) {

    return router.createUrlTree([
      '/dashboard'
    ]);

  }


  /*
   * Operador activo:
   * puede utilizar el POS normalmente.
   */
  if (
    operatorStateService.isOperatorActive()
  ) {

    return true;

  }


  /*
   * Sin ninguna sesión:
   * POS público permitido.
   */
  return true;

};