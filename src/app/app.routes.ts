import { Routes } from '@angular/router';

import { PosComponent }
  from './features/sales/pages/pos/pos.component';

import { LoginComponent }
  from './features/auth/pages/login/login.component';

import { AdminComponent }
  from './features/auth/pages/admin/admin.component';

import { DashboardComponent }
  from './features/dashboard/pages/dashboard/dashboard.component';

import { CashRegisterComponent }
  from './features/cash-register/pages/cash-register/cash-register.component';

import { OperatorSelectionComponent }
  from './features/operator/pages/operator-selection/operator-selection.component';

import { adminGuard }
  from './core/guards/admin.guard';

import { noActiveSessionGuard }
  from './core/guards/no-active-session.guard';


export const routes: Routes = [

  // ============================================================
  // POS
  // ============================================================

  {
    path: '',
    component: PosComponent
  },


  // ============================================================
  // LOGIN ADMINISTRATIVO
  // ============================================================

  {
    path: 'login',
    component: LoginComponent,
    canActivate: [
      noActiveSessionGuard
    ]
  },


  // ============================================================
  // ADMINISTRACIÓN
  // ============================================================

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [
      adminGuard
    ]
  },


  // ============================================================
  // DASHBOARD
  // ============================================================

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [
      adminGuard
    ]
  },


  // ============================================================
  // CAJA
  // ============================================================

  {
    path: 'cash-register',
    component: CashRegisterComponent,
    canActivate: [
      adminGuard
    ]
  },


  // ============================================================
  // SELECCIÓN DE OPERADOR
  // ============================================================

  {
    path: 'operator-selection',
    component: OperatorSelectionComponent,
    canActivate: [
      noActiveSessionGuard
    ]
  },


  // ============================================================
  // RUTA NO EXISTENTE
  // ============================================================

  {
    path: '**',
    redirectTo: ''
  }

];