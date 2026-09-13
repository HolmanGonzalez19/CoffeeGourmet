import { Routes } from '@angular/router';

import { PosComponent }
  from './features/sales/pages/pos/pos.component';

import { LoginComponent }
  from './features/auth/pages/login/login.component';

import { DashboardComponent }
  from './features/dashboard/pages/dashboard/dashboard.component';

import { CashRegisterComponent }
  from './features/cash-register/pages/cash-register/cash-register.component';

import { OperatorSelectionComponent }
  from './features/operator/pages/operator-selection/operator-selection.component';

import { SalesComponent }
  from './features/sales/components/sale/sale.component';

import { ProductComponent }
  from './features/product/components/product.component';

import { InventoryComponent }
  from './features/inventory/components/inventory/inventory.component';

import { PurchasesComponent }
  from './features/purchases/pages/purchases/purchases.component';

import { PurchaseFormComponent }
  from './features/purchases/pages/purchase-form/purchase-form.component';

import { PurchaseDetailComponent }
  from './features/purchases/pages/purchase-detail/purchase-detail.component';

import { StatisticsComponent }
  from './features/statistics/statistics.component';

import { AdminLayoutComponent }
  from './layout/admin-layout/admin-layout.component';

import { adminGuard }
  from './core/guards/admin.guard';

import { noActiveSessionGuard }
  from './core/guards/no-active-session.guard';
import { UsersComponent } from './features/user/user.component';


export const routes: Routes = [

  /*
   * ============================================================
   * POS
   * ============================================================
   */
  {
    path: '',
    component: PosComponent,
    canActivate: [
      noActiveSessionGuard
    ]
  },


  /*
   * ============================================================
   * LOGIN ADMINISTRATIVO
   * ============================================================
   */
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [
      noActiveSessionGuard
    ]
  },


  /*
   * ============================================================
   * ADMINISTRACIÓN
   * ============================================================
   */
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [
      adminGuard
    ],
    children: [

      /*
       * ========================================================
       * DASHBOARD
       * ========================================================
       */
      {
        path: 'dashboard',
        component: DashboardComponent
      },


      /*
       * ========================================================
       * CAJA
       * ========================================================
       */
      {
        path: 'cash-register',
        component: CashRegisterComponent
      },


      /*
       * ========================================================
       * VENTAS
       * ========================================================
       */
      {
        path: 'sales',
        component: SalesComponent
      },


      /*
       * ========================================================
       * PRODUCTOS
       * ========================================================
       */
      {
        path: 'products',
        component: ProductComponent
      },


      /*
       * ========================================================
       * INVENTARIO
       * ========================================================
       */
      {
        path: 'inventory',
        component: InventoryComponent
      },


      /*
       * ========================================================
       * COMPRAS
       * ========================================================
       */
      {
        path: 'purchases',
        component: PurchasesComponent
      },

      {
        path: 'purchases/new',
        component: PurchaseFormComponent
      },

      {
        path: 'purchases/:id',
        component: PurchaseDetailComponent
      },


      /*
       * ========================================================
       * ESTADÍSTICAS
       * ========================================================
       */
      {
        path: 'statistics',
        component: StatisticsComponent
      },

      /*
       * ========================================================
       * USUARIOS
       * ========================================================
       */
      {
        path: 'users',
        component: UsersComponent
      },


      /*
       * ========================================================
       * RUTA ADMIN POR DEFECTO
       * ========================================================
       */
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }

    ]
  },


  /*
   * ============================================================
   * SELECCIÓN DE OPERADOR
   * ============================================================
   */
  {
    path: 'operator-selection',
    component: OperatorSelectionComponent,
    canActivate: [
      noActiveSessionGuard
    ]
  },


  /*
   * ============================================================
   * RUTA NO EXISTENTE
   * ============================================================
   */
  {
    path: '**',
    redirectTo: ''
  }

];