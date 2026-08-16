import {
  HttpInterceptorFn
} from '@angular/common/http';

import {
  inject
} from '@angular/core';

import {
  AuthService
} from '../services/auth.service';

import {
  OperatorStateService
} from '../services/operator-state.service';


export const authInterceptor:
  HttpInterceptorFn = (req, next) => {

  const authService =
    inject(AuthService);

  const operatorStateService =
    inject(OperatorStateService);


  // ============================================================
  // AUTENTICACIÓN
  // ============================================================

  /*
   * Login administrativo y login mediante PIN
   * no deben enviar un JWT anterior.
   */
  if (
    req.url.includes('/api/auth/')
  ) {

    return next(req);

  }


  // ============================================================
  // OPERADOR ACTIVO
  // ============================================================

  const operator =
    operatorStateService.currentOperator();


  if (operator?.token) {

    return next(
      req.clone({
        setHeaders: {
          Authorization:
            `Bearer ${operator.token}`
        }
      })
    );

  }


  // ============================================================
  // ADMINISTRADOR ACTIVO
  // ============================================================

  const adminToken =
    authService.getToken();


  if (adminToken) {

    return next(
      req.clone({
        setHeaders: {
          Authorization:
            `Bearer ${adminToken}`
        }
      })
    );

  }


  // ============================================================
  // SIN SESIÓN
  // ============================================================

  return next(req);

};