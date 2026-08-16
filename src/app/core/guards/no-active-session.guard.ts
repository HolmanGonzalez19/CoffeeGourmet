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


  const adminActive =
    authService.isAdminSessionActive();

  const operatorActive =
    operatorStateService.isOperatorActive();


  if (
    adminActive ||
    operatorActive
  ) {

    return router.createUrlTree([
      '/'
    ]);

  }


  return true;

};