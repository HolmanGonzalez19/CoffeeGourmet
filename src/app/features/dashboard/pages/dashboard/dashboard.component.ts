import {
    Component,
    inject,
    OnInit
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { Dashboard } from '../../../../core/models/dashboard.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CurrencyPipe
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
    private readonly dashboardService = inject(DashboardService);
    private readonly router = inject(Router);

    dashboard: Dashboard | null = null;
    loading = true;
    errorMessage = '';

    ngOnInit(): void {
        this.loadDashboard();
    }

    /*loadDashboard(): void {
      this.loading = true;
      this.errorMessage = '';
  
      this.dashboardService.getDashboard().subscribe({
        next: response => {
          this.dashboard = response;
          this.loading = false;
        },
        error: error => {
          this.loading = false;
  
          if (error.status === 401) {
            this.errorMessage = 'La sesión ha expirado.';
            return;
          }
  
          if (error.status === 403) {
            this.errorMessage = 'No posee permisos para consultar el dashboard.';
            return;
          }
  
          this.errorMessage = 'No fue posible consultar el dashboard.';
        }
      });
    }*/

    loadDashboard(): void {
        this.loading = true;
        this.errorMessage = '';

        console.log('[Dashboard] Consultando dashboard...');

        this.dashboardService.getDashboard().subscribe({
            next: response => {
                console.log('[Dashboard] Respuesta recibida:', response);

                this.dashboard = response;
                this.loading = false;

                console.log('[Dashboard] loading:', this.loading);
                console.log('[Dashboard] dashboard:', this.dashboard);
            },
            error: error => {
                console.error('[Dashboard] Error:', error);

                this.loading = false;

                if (error.status === 401) {
                    this.errorMessage = 'La sesión ha expirado.';
                    return;
                }

                if (error.status === 403) {
                    this.errorMessage =
                        'No posee permisos para consultar el dashboard.';
                    return;
                }

                this.errorMessage =
                    'No fue posible consultar el dashboard.';
            },
            complete: () => {
                console.log('[Dashboard] Petición completada');
            }
        });
    }

    irACaja(): void {
        this.router.navigate(['/cash-register']);
    }

    irAlPos(): void {
        this.router.navigate(['/']);
    }

    logout(): void {
        this.router.navigate(['/']);
    }
}