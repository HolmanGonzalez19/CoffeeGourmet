import { Routes } from '@angular/router';
import { PosComponent } from './features/sales/pages/pos/pos.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { AdminComponent } from './features/auth/pages/admin/admin.component';
import { DashboardComponent } from './features/dashboard/pages/dashboard/dashboard.component';
import { CashRegisterComponent } from './features/cash-register/pages/cash-register/cash-register.component';
import { OperatorSelectionComponent } from './features/operator/pages/operator-selection/operator-selection.component';

export const routes: Routes = [
  {
    path: '',
    component: PosComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'cash-register',
    component: CashRegisterComponent
  },
  {
    path: 'operator-selection',
    component: OperatorSelectionComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];