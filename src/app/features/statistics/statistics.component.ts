import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { StatisticsService } from '../../core/services/statistics.service';
import {
    Statistics,
    ProductSale
} from '../../core/models/statistics.model';

@Component({
    selector: 'app-statistics',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './statistics.component.html',
    styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit {

    private readonly statisticsService =
        inject(StatisticsService);

    private readonly router =
        inject(Router);


    // ============================================================
    // ESTADO
    // ============================================================

    statistics: Statistics | null = null;

    loading = false;

    errorMessage = '';


    // ============================================================
    // INICIALIZACIÓN
    // ============================================================

    ngOnInit(): void {

        this.cargarEstadisticas();

    }


    // ============================================================
    // CARGAR ESTADÍSTICAS
    // ============================================================

    cargarEstadisticas(): void {

        this.loading = true;

        this.errorMessage = '';

        this.statisticsService
            .getStatistics()
            .subscribe({

                next: (data: Statistics) => {

                    this.statistics = data;

                    this.loading = false;

                },

                error: (error: unknown) => {

                    console.error(
                        'Error al cargar estadísticas:',
                        error
                    );

                    this.errorMessage =
                        'No fue posible cargar las estadísticas.';

                    this.loading = false;

                }

            });

    }


    // ============================================================
    // FORMATO DE MONEDA
    // ============================================================

    formatearPrecio(
        valor: number | null
    ): string {

        if (valor === null) {

            return '$0';

        }

        return new Intl.NumberFormat(
            'es-CO',
            {
                style: 'currency',
                currency: 'COP',
                maximumFractionDigits: 0
            }
        ).format(valor);

    }


    // ============================================================
    // PRODUCTOS MÁS VENDIDOS
    // ============================================================

    get productosMasVendidos(): ProductSale[] {

        return this.statistics
            ?.productosMasVendidos
            ?? [];

    }


    // ============================================================
    // NAVEGACIÓN
    // ============================================================

    volverAlDashboard(): void {

        this.router.navigate([
            '/dashboard'
        ]);

    }

}