import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { SupplierService } from '../../core/services/supplier.service';
import { GetSuppliers } from '../../core/models/supplier.model';
import { CreateSupplierComponent } from './create-suppplier/create-supplier.component';

@Component({
    selector: 'app-suppliers',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatPaginatorModule
    ],
    templateUrl: './suppliers.component.html',
    styleUrl: './suppliers.component.scss'
})
export class SuppliersComponent implements OnInit {

    private readonly supplierService = inject(SupplierService);
    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);

    suppliers: GetSuppliers[] = [];
    suppliersFiltrados: GetSuppliers[] = [];
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    suppliersPaginados: GetSuppliers[] = [];
    paginaActual = 0;
    registrosPorPagina = 10;
    totalRegistros = 0;
    loading = false;
    errorMessage = '';
    filtroBusqueda = '';
    filtroEstado = '';

    ngOnInit(): void {
        this.cargarProveedores();
    }

    cargarProveedores(): void {
        this.loading = true;
        this.errorMessage = '';

        let request: Observable<GetSuppliers[]>;

        switch (this.filtroEstado) {
            case 'INACTIVOS':
                request = this.supplierService.getInactiveSuppliers();
                break;
            case '':
                request = this.supplierService.getAllSuppliers();
                break;
            case 'ACTIVOS':
            default:
                request = this.supplierService.getAll();
                break;
        }

        request.subscribe({
            next: (supplier: GetSuppliers[]) => {
                this.suppliers = supplier;
                this.generarOpcionesFiltros();
                this.aplicarFiltros();
                this.loading = false;
            },
            error: error => {
                this.errorMessage =
                error.error?.message ??
                'No fue posible cargar los Proveedores.';
                this.loading = false;
            }
        });
    }

    private generarOpcionesFiltros(): void {
    }

    aplicarFiltros(): void {
        const busqueda = this.filtroBusqueda.trim().toLowerCase();

        this.suppliersFiltrados = this.suppliers.filter(suppliers => {
            if (busqueda) {
                const coincideBusqueda =
                    suppliers.nombre
                        .toLowerCase()
                        .includes(busqueda);

                if (!coincideBusqueda) {
                    return false;
                }
            }

            return true;
        });

        this.paginaActual = 0;
        this.totalRegistros = this.suppliersFiltrados.length;
        this.actualizarSuppliersPaginados();
    }

    private actualizarSuppliersPaginados(): void {
        const inicio = this.paginaActual * this.registrosPorPagina;
        const fin = inicio + this.registrosPorPagina;

        this.suppliersPaginados = this.suppliersFiltrados.slice(
            inicio,
            fin
        );
    }

    handlePageEvent(event: PageEvent): void {
        this.paginaActual = event.pageIndex;
        this.registrosPorPagina = event.pageSize;
        this.actualizarSuppliersPaginados();
    }

    limpiarFiltros(): void {
        this.filtroBusqueda = '';
        this.filtroEstado = '';
        this.cargarProveedores();
    }

    obtenerTotalPaginas(): number {
        if (this.totalRegistros === 0) {
            return 1;
        }

        return Math.ceil(
            this.totalRegistros / this.registrosPorPagina
        );
    }

    formatearPrecio(precio: number | null): string {
        if (precio === null) {
            return 'Sin precio';
        }

        return new Intl.NumberFormat(
            'es-CO',
            {
                style: 'currency',
                currency: 'COP',
                maximumFractionDigits: 0
            }
        ).format(precio);
    }

    obtenerTextoEstado(activo: boolean): string {
        return activo ? 'Activo' : 'Inactivo';
    }

    volverAlDashboard(): void {
        this.router.navigate([
            'admin/dashboard'
        ]);
    }

    crearProveedor(): void {
        const dialogRef = this.dialog.open(
            CreateSupplierComponent,
            {
                width: '800px',
                maxWidth: 'calc(100vw - 50px)',
                height: '536px',
                disableClose: true,
                autoFocus: false,
                panelClass: 'create-product-dialog'
            }
        );

        dialogRef.afterClosed().subscribe((guardado: boolean) => {
            if (guardado) {
                this.cargarProveedores();
            }
        });
    }

    editarProveedor(supplier: GetSuppliers): void {
        const dialogRef = this.dialog.open(
            CreateSupplierComponent,
            {
                width: '800px',
                maxWidth: 'calc(100vw - 50px)',
                height: '536px',
                disableClose: true,
                autoFocus: false,
                panelClass: 'create-product-dialog',
                data: supplier
            }
        );

        dialogRef.afterClosed().subscribe((guardado: boolean) => {
            if (guardado) {
                this.cargarProveedores();
            }
        });
    }

    cambiarEstado(supplier: GetSuppliers): void {
        const accion = supplier.activo
            ? 'desactivar'
            : 'activar';

        const confirmado = window.confirm(
            `¿Está seguro de ${accion} el producto "${supplier.nombre}"?`
        );

        if (!confirmado) {
            return;
        }

        this.loading = true;
        this.errorMessage = '';

        const request$ = supplier.activo
            ? this.supplierService.deactivate(supplier.id)
            : this.supplierService.activate(supplier.id);

        request$.subscribe({
            next: () => {
                this.cargarProveedores();
            },
            error: (error) => {
                this.errorMessage =
                error.error?.message ??
                'No fue posible ${accion} el producto.';
                this.loading = false;

                this.loading = false;
            }
        });
    }

    cambiarFiltroEstado(): void {
        this.cargarProveedores();
    }

    mostrarFormulario = false;
    formErrorMessage = '';
    modoEdicion = false;
    productoEditandoId: number | null = null;
    productoActivo = true;
}