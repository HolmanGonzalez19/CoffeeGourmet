import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleResponse } from '../../../../core/models/sale.model';
import {
    SaleService
} from '../../../../core/services/sale.service';
import { Router } from '@angular/router';
import {
    SaleFilters
} from '../../../../core/services/sale.service';
import { FormsModule } from '@angular/forms';


import { PaymentMethodService } from '../../../../core/services/payment-method.service';
import { CashRegisterService } from '../../../../core/services/cash-register.service';

import { PaymentMethod } from '../../../../core/models/payment-method.model';
import { CashRegister } from '../../../../core/models/cash-register.model';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';




@Component({
    selector: 'app-sale',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule
    ],
    templateUrl: './sale.component.html',
    styleUrl: './sale.component.scss'
})
export class SalesComponent implements OnInit {

    private readonly saleService = inject(SaleService);

    private readonly router = inject(Router);

    private readonly userService = inject(UserService);

    private readonly paymentMethodService =
        inject(PaymentMethodService);

    private readonly cashRegisterService =
        inject(CashRegisterService);

    ventas: SaleResponse[] = [];
    usuarios: User[] = [];

    metodosPago: PaymentMethod[] = [];

    cajas: CashRegister[] = [];

    loading = false;
    errorMessage = '';

    // ============================================================
    // PAGINACIÓN
    // ============================================================

    paginaActual = 0;

    readonly registrosPorPagina = 200;

    totalRegistros = 0;

    totalPaginas = 0;

    // ============================================================
    // FILTROS
    // ============================================================

    filtroCajaId: number | null = null;

    filtroUsuarioId: number | null = null;

    filtroMetodoPagoId: number | null = null;

    filtroEstado: string | null = null;

    filtroFechaInicio = '';

    filtroFechaFin = '';


    ngOnInit(): void {

        this.cargarFiltros();
        this.cargarVentas();

    }


    cargarVentas(): void {

        this.loading = true;

        this.errorMessage = '';

        const filtros: SaleFilters = {

            cajaId:
                this.filtroCajaId ?? undefined,

            usuarioId:
                this.filtroUsuarioId ?? undefined,

            metodoPagoId:
                this.filtroMetodoPagoId ?? undefined,

            estado:
                this.filtroEstado || undefined,

            fechaInicio:
                this.filtroFechaInicio || undefined,

            fechaFin:
                this.filtroFechaFin || undefined

        };


        this.saleService.findWithFilters(
            filtros,
            this.paginaActual,
            this.registrosPorPagina
        ).subscribe({

            next: (response) => {

                this.ventas = response.content;

                this.totalRegistros =
                    response.totalElements;

                this.totalPaginas =
                    response.totalPages;

                this.loading = false;

            },

            error: (error) => {

                console.error(
                    'Error al consultar ventas:',
                    error
                );

                this.errorMessage =
                    'No fue posible cargar las ventas.';

                this.loading = false;

            }

        });

    }
    


    aplicarFiltros(): void {

        this.paginaActual = 0;

        this.cargarVentas();

    }


    limpiarFiltros(): void {

        this.filtroCajaId = null;

        this.filtroUsuarioId = null;

        this.filtroMetodoPagoId = null;

        this.filtroEstado = null;

        this.filtroFechaInicio = '';

        this.filtroFechaFin = '';

        this.paginaActual = 0;

        this.cargarVentas();

    }


    paginaAnterior(): void {

        if (this.paginaActual <= 0) {
            return;
        }

        this.paginaActual--;

        this.cargarVentas();

    }


    paginaSiguiente(): void {

        if (this.paginaActual >= this.totalPaginas - 1) {
            return;
        }

        this.paginaActual++;

        this.cargarVentas();

    }


    obtenerCantidadProductos(
        venta: SaleResponse
    ): number {

        return venta.detalles.reduce(
            (total, detalle) =>
                total + detalle.cantidad,
            0
        );

    }


    volverAlDashboard(): void {

        this.router.navigate(['/dashboard']);

    }

    cargarFiltros(): void {

    this.userService.getActive().subscribe({
        next: (usuarios) => {

            this.usuarios = usuarios;

        },
        error: (error) => {

            console.error(
                'Error al cargar usuarios:',
                error
            );

        }
    });


    this.paymentMethodService.getActive().subscribe({
        next: (metodos) => {

            this.metodosPago = metodos;

        },
        error: (error) => {

            console.error(
                'Error al cargar métodos de pago:',
                error
            );

        }
    });


    this.cashRegisterService.getAll().subscribe({
        next: (cajas) => {

            this.cajas = cajas;

        },
        error: (error) => {

            console.error(
                'Error al cargar cajas:',
                error
            );

        }
    });

}
}