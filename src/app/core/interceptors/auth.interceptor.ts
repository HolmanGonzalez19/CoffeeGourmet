import {
  HttpInterceptorFn
} from '@angular/common/http';

import {
  inject
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  catchError,
  throwError
} from 'rxjs';

import {
  AuthService
} from '../services/auth.service';

import {
  OperatorStateService
} from '../services/operator-state.service';

import {
  NotificationService
} from '../services/notification.service';


export const authInterceptor:
  HttpInterceptorFn = (req, next) => {

  const authService =
    inject(AuthService);

  const operatorStateService =
    inject(OperatorStateService);

  const router =
    inject(Router);

  const notificationService =
    inject(NotificationService);


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
  // TOKEN
  // ============================================================

  const operator =
    operatorStateService.currentOperator();

  const adminToken =
    authService.getToken();


  let request = req;


  if (operator?.token) {

    request =
      req.clone({
        setHeaders: {
          Authorization:
            `Bearer ${operator.token}`
        }
      });

  } else if (adminToken) {

    request =
      req.clone({
        setHeaders: {
          Authorization:
            `Bearer ${adminToken}`
        }
      });

  }


  // ============================================================
  // PETICIÓN
  // ============================================================

  return next(request).pipe(

    catchError(error => {

      if (error.status === 401) {

        // ------------------------------------------------------
        // OPERADOR
        // ------------------------------------------------------

        if (operator?.token) {

          operatorStateService.clearOperator();

          notificationService.warning(
            'La sesión ha expirado.'
          );

          router.navigate(['/']);

        }

        // ------------------------------------------------------
        // ADMINISTRADOR
        // ------------------------------------------------------

        else if (adminToken) {

          authService.logout();

          notificationService.warning(
            'La sesión ha expirado.'
          );

          router.navigate(['/login']);

        }

      }

      return throwError(
        () => error
      );

    })

  );

};