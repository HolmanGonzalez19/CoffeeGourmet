import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { OperatorStateService } from '../services/operator-state.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);

  const operatorStateService =
    inject(OperatorStateService);


  /*
   * Las peticiones de autenticación no necesitan
   * enviar un JWT existente.
   */
  if (req.url.includes('/api/auth/')) {
    return next(req);
  }


  /*
   * ============================================================
   * OPERADOR ACTIVO
   * ============================================================
   *
   * Si existe un operador activo, el POS debe utilizar
   * exclusivamente el token del operador.
   */
  const operator =
    operatorStateService.currentOperator();


  if (operator?.token) {

    const authenticatedRequest =
      req.clone({
        setHeaders: {
          Authorization:
            `Bearer ${operator.token}`
        }
      });

    return next(authenticatedRequest);
  }


  /*
   * ============================================================
   * ADMINISTRADOR
   * ============================================================
   *
   * Si no existe operador activo, utilizamos la sesión
   * administrativa almacenada en AuthService.
   */
  const token =
    authService.getToken();


  if (!token) {
    return next(req);
  }


  const authenticatedRequest =
    req.clone({
      setHeaders: {
        Authorization:
          `Bearer ${token}`
      }
    });


  return next(authenticatedRequest);
};