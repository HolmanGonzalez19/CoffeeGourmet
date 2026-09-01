import {
    Component,
    inject,
    OnInit
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { Dashboard } from '../../../../core/models/dashboard.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CurrencyPipe,
        DatePipe
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
    private readonly dashboardService = inject(DashboardService);
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);

    dashboard!: Dashboard;
    loading = true;
    errorMessage = '';

    ngOnInit(): void {
        this.loadDashboard();
    }

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

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/']);
    }

    getMaxVentaMensual(): number {

        if (
            !this.dashboard ||
            this.dashboard.ventasPorMes.length === 0
        ) {
            return 1;
        }

        return Math.max(
            ...this.dashboard.ventasPorMes.map(
                venta => venta.total
            )
        );
    }


    formatearMes(mes: string): string {

        const [anio, numeroMes] = mes.split('-');

        const fecha = new Date(
            Number(anio),
            Number(numeroMes) - 1,
            1
        );

        return fecha.toLocaleDateString(
            'es-CO',
            {
                month: 'short'
            }
        ).replace('.', '');
    }

    irAVentas(): void {

        this.router.navigate(['/sales']);

    }

    irAProductos(): void {

    this.router.navigate(['/products']);

    }

    irAInventario(): void {

    this.router.navigate(['/inventory']);

    }

    irACompras(): void {

    this.router.navigate(['/purchases']);

    }

    irAEstadisticas(): void {

    this.router.navigate(['/statistics']);

    }
}