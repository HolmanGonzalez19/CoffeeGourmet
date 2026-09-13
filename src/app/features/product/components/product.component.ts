import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
    ProductService
} from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

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
import { CreateProductComponent } from './create-product/create-product.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-product',
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
    templateUrl: './product.component.html',
    styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {

    private readonly productService =
        inject(ProductService);

    private readonly router =
        inject(Router);

        private readonly dialog = inject(MatDialog);


    productos: Product[] = [];

    productosFiltrados: Product[] = [];

    // ============================================================
    // PAGINACIÓN
    // ============================================================

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    productosPaginados: Product[] = [];

    paginaActual = 0;

    registrosPorPagina = 10;

    totalRegistros = 0;

    loading = false;

    errorMessage = '';

    // ============================================================
    // FILTROS
    // ============================================================

    filtroBusqueda = '';

    filtroCategoria: number | null = null;

    filtroTipo = '';

    filtroEstado = '';


    // ============================================================
    // OPCIONES DE FILTROS
    // ============================================================

    categorias: {
        id: number;
        nombre: string;
    }[] = [];

    tiposProducto: string[] = [];


    ngOnInit(): void {

        this.cargarProductos();

    }


    // ============================================================
    // CARGAR PRODUCTOS
    // ============================================================

   cargarProductos(): void {

    this.loading = true;

    this.errorMessage = '';

    let request: Observable<Product[]>;

    switch (this.filtroEstado) {

        case 'INACTIVOS':

            request =
                this.productService.getInactiveProducts();

            break;

        case '':

            request =
                this.productService.getAllProducts();

            break;

        case 'ACTIVOS':
        default:

            request =
                this.productService.getProducts();

            break;
    }

    request.subscribe({

        next: (productos: Product[]) => {

            this.productos = productos;

            this.generarOpcionesFiltros();

            this.aplicarFiltros();

            this.loading = false;

        },

        error: (error: unknown) => {

            console.error(
                'Error al cargar productos:',
                error
            );

            this.errorMessage =
                'No fue posible cargar los productos.';

            this.loading = false;

        }

    });

}

    // ============================================================
    // GENERAR OPCIONES
    // ============================================================

    private generarOpcionesFiltros(): void {

        const categoriasMap =
            new Map<number, string>();

        const tipos = new Set<string>();


        this.productos.forEach(producto => {

            categoriasMap.set(
                producto.categoriaId,
                producto.categoriaNombre
            );

            if (producto.tipoProducto) {

                tipos.add(producto.tipoProducto);

            }

        });


        this.categorias =
            Array.from(categoriasMap.entries())
                .map(([id, nombre]) => ({
                    id,
                    nombre
                }))
                .sort((a, b) =>
                    a.nombre.localeCompare(b.nombre)
                );


        this.tiposProducto =
            Array.from(tipos)
                .sort((a, b) =>
                    a.localeCompare(b)
                );

    }


    // ============================================================
    // APLICAR FILTROS
    // ============================================================

    aplicarFiltros(): void {
        const busqueda =
            this.filtroBusqueda
                .trim()
                .toLowerCase();

        
        
        this.productosFiltrados =
            this.productos.filter(producto => {

                // --------------------------------------------------------
                // ESTADO
                // --------------------------------------------------------

                if (
                    this.filtroEstado === 'ACTIVOS'
                    && !producto.activo
                ) {

                    return false;

                }


                if (
                    this.filtroEstado === 'INACTIVOS'
                    && producto.activo
                ) {

                    return false;

                }


                // --------------------------------------------------------
                // BÚSQUEDA
                // --------------------------------------------------------

                if (busqueda) {

                    const coincideBusqueda =

                        producto.nombre
                            .toLowerCase()
                            .includes(busqueda)

                        ||

                        producto.codigo
                            .toLowerCase()
                            .includes(busqueda)

                        ||

                        (
                            producto.codigoBarras
                                ?.toLowerCase()
                                .includes(busqueda)
                            ?? false
                        );

                    if (!coincideBusqueda) {

                        return false;

                    }

                }


                // --------------------------------------------------------
                // CATEGORÍA
                // --------------------------------------------------------

                if (
                    this.filtroCategoria !== null
                    &&
                    producto.categoriaId !==
                    this.filtroCategoria
                ) {

                    return false;

                }


                // --------------------------------------------------------
                // TIPO
                // --------------------------------------------------------

                if (
                    this.filtroTipo
                    &&
                    producto.tipoProducto !==
                    this.filtroTipo
                ) {

                    return false;

                }


                return true;

            });

            // ============================================================
    // ACTUALIZAR PAGINACIÓN
    // ============================================================

    this.paginaActual = 0;

    this.totalRegistros =
        this.productosFiltrados.length;

    this.actualizarProductosPaginados();
    }

    // ============================================================
// ACTUALIZAR PRODUCTOS DE LA PÁGINA
// ============================================================

private actualizarProductosPaginados(): void {

    const inicio =
        this.paginaActual *
        this.registrosPorPagina;

    const fin =
        inicio +
        this.registrosPorPagina;

    this.productosPaginados =
        this.productosFiltrados.slice(
            inicio,
            fin
        );

}


// ============================================================
// CAMBIAR PÁGINA
// ============================================================

handlePageEvent(event: PageEvent): void {

    this.paginaActual =
        event.pageIndex;

    this.registrosPorPagina =
        event.pageSize;

    this.actualizarProductosPaginados();

}

    

    // ============================================================
    // LIMPIAR FILTROS
    // ============================================================

    limpiarFiltros(): void {

        this.filtroBusqueda = '';

        this.filtroCategoria = null;

        this.filtroTipo = '';

        this.filtroEstado = '';

        this.cargarProductos();

    }

    obtenerTotalPaginas(): number {

        if (this.totalRegistros === 0) {
            return 1;
        }

        return Math.ceil(
            this.totalRegistros /
            this.registrosPorPagina
        );

    }


    // ============================================================
    // FORMATO DE PRECIO
    // ============================================================

    formatearPrecio(
        precio: number | null
    ): string {

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


    // ============================================================
    // ESTADO
    // ============================================================

    obtenerTextoEstado(
        activo: boolean
    ): string {

        return activo
            ? 'Activo'
            : 'Inactivo';

    }


    // ============================================================
    // NAVEGACIÓN
    // ============================================================

    volverAlDashboard(): void {

        this.router.navigate([
            'admin/dashboard'
        ]);

    }


    crearProducto(): void {
        const dialogRef = this.dialog.open(
            CreateProductComponent,
            {
            width: '800px',
            maxWidth: 'calc(100vw - 50px)',
            height: '751px',
            disableClose: true,
            autoFocus: false,
            panelClass: 'create-product-dialog'
            }
        );
        dialogRef.afterClosed().subscribe((guardado: boolean) => {
            if (guardado) {
                this.cargarProductos();
            }
        });
}




    editarProducto(producto: Product): void {
        const dialogRef = this.dialog.open(
            CreateProductComponent,
            {
            width: '800px',
            maxWidth: 'calc(100vw - 50px)',
            height: '751px',
            disableClose: true,
            autoFocus: false,
            panelClass: 'create-product-dialog',
            data: producto
            }
        );

        dialogRef.afterClosed().subscribe((guardado: boolean) => {
            if (guardado) {
                this.cargarProductos();
            }
        });
}


    cambiarEstado(producto: Product): void {

        const accion = producto.activo
            ? 'desactivar'
            : 'activar';

        const confirmado = window.confirm(
            `¿Está seguro de ${accion} el producto "${producto.nombre}"?`
        );

        if (!confirmado) {
            return;
        }

        this.loading = true;

        this.errorMessage = '';

        const request$ = producto.activo
            ? this.productService.deactivate(producto.id)
            : this.productService.activate(producto.id);

        request$.subscribe({

            next: () => {

                this.cargarProductos();

            },

            error: (error) => {

                console.error(
                    `Error al ${accion} producto:`,
                    error
                );

                this.errorMessage =
                    `No fue posible ${accion} el producto.`;

                this.loading = false;

            }

        });

    }

    cambiarFiltroEstado(): void {

    this.cargarProductos();

}

// ============================================================
// FORMULARIO PRODUCTO
// ============================================================

mostrarFormulario = false;


formErrorMessage = '';

modoEdicion = false;

productoEditandoId: number | null = null;
productoActivo = true;

}