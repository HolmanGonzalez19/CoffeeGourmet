import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
    ProductService,
    CreateProductRequest,
    UpdateProductRequest
} from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

import { Observable } from 'rxjs';

@Component({
    selector: 'app-product',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule
    ],
    templateUrl: './product.component.html',
    styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {

    private readonly productService =
        inject(ProductService);

    private readonly router =
        inject(Router);


    productos: Product[] = [];

    productosFiltrados: Product[] = [];

    loading = false;

    errorMessage = '';

    // ============================================================
    // FILTROS
    // ============================================================

    filtroBusqueda = '';

    filtroCategoria: number | null = null;

    filtroTipo = '';

    filtroEstado = 'ACTIVOS';


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

        case 'TODOS':

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

    }


    // ============================================================
    // LIMPIAR FILTROS
    // ============================================================

    limpiarFiltros(): void {

        this.filtroBusqueda = '';

        this.filtroCategoria = null;

        this.filtroTipo = '';

        this.filtroEstado = 'ACTIVOS';

        this.aplicarFiltros();

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
            '/dashboard'
        ]);

    }


    crearProducto(): void {

    this.formErrorMessage = '';

    this.modoEdicion = false;

    this.productoEditandoId = null;

    this.productoActivo = true;

    this.productoForm = {

        nombre: '',

        categoriaId: 0,

        tipoProducto: '',

        codigoBarras: null,

        stockMinimo: 0,

        descripcion: null,

        precioCompra: 0,

        precioVenta: 0

    };

    this.mostrarFormulario = true;

}

cerrarFormulario(): void {

    if (this.guardandoProducto) {
        return;
    }

    this.mostrarFormulario = false;

    this.formErrorMessage = '';

}

guardarProducto(): void {

    this.formErrorMessage = '';

    // ==========================================================
    // VALIDACIONES
    // ==========================================================


    if (!this.productoForm.nombre.trim()) {

        this.formErrorMessage =
            'El nombre es obligatorio.';

        return;

    }

    if (!this.productoForm.categoriaId) {

        this.formErrorMessage =
            'Debe seleccionar una categoría.';

        return;

    }

    if (!this.productoForm.tipoProducto) {

        this.formErrorMessage =
            'Debe seleccionar un tipo de producto.';

        return;

    }

    if (this.productoForm.stockMinimo < 0) {

        this.formErrorMessage =
            'Las existencias mínimas no puede ser negativas.';

        return;

    }

    // ==========================================================
    // EDICIÓN
    // ==========================================================

    if (
        this.modoEdicion &&
        this.productoEditandoId !== null
    ) {

        this.guardarEdicion();

        return;

    }

    // ==========================================================
    // CREACIÓN
    // ==========================================================

    if (this.productoForm.precioCompra < 0) {

        this.formErrorMessage =
            'El precio de compra no puede ser negativo.';

        return;

    }

    if (this.productoForm.precioVenta <= 0) {

        this.formErrorMessage =
            'El precio de venta debe ser mayor que cero.';

        return;

    }

    this.guardandoProducto = true;

    const request: CreateProductRequest = {

        ...this.productoForm,

        nombre:
            this.productoForm.nombre.trim(),

        codigoBarras:
            this.productoForm.codigoBarras?.trim()
            || null,

        descripcion:
            this.productoForm.descripcion?.trim()
            || null

    };

    this.productService
        .create(request)
        .subscribe({

            next: () => {

                this.guardandoProducto = false;

                this.mostrarFormulario = false;

                this.cargarProductos();

            },

            error: (error: unknown) => {

                console.error(
                    'Error al crear producto:',
                    error
                );

                this.formErrorMessage =
                    'No fue posible crear el producto.';

                this.guardandoProducto = false;

            }

        });

}


    editarProducto(producto: Product): void {

    this.formErrorMessage = '';

    this.modoEdicion = true;

    this.productoEditandoId = producto.id;

    this.productoActivo = producto.activo;

    this.productoForm = {

        nombre: producto.nombre,

        categoriaId: producto.categoriaId,

        tipoProducto: producto.tipoProducto,

        codigoBarras: producto.codigoBarras,

        stockMinimo: producto.stockMinimo,

        descripcion: producto.descripcion,

        precioCompra: producto.precioCompra ?? 0,

        precioVenta: producto.precioVenta ?? 0

    };

    this.mostrarFormulario = true;

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

guardandoProducto = false;

formErrorMessage = '';

modoEdicion = false;

productoEditandoId: number | null = null;
productoActivo = true;

productoForm: CreateProductRequest = {

    nombre: '',

    categoriaId: 0,

    tipoProducto: '',

    codigoBarras: null,

    stockMinimo: 0,

    descripcion: null,

    precioCompra: 0,

    precioVenta: 0

};


private guardarEdicion(): void {

    if (this.productoEditandoId === null) {
        return;
    }

    this.guardandoProducto = true;

    const request: UpdateProductRequest = {

        nombre:
            this.productoForm.nombre.trim(),

        categoriaId:
            this.productoForm.categoriaId,

        tipoProducto:
            this.productoForm.tipoProducto,

        codigoBarras:
            this.productoForm.codigoBarras?.trim()
            || null,

        stockMinimo:
            this.productoForm.stockMinimo,

        descripcion:
            this.productoForm.descripcion?.trim()
            || null,

        activo:
            this.productoActivo,

        precioCompra:
            this.productoForm.precioCompra,

        precioVenta:
            this.productoForm.precioVenta

    };

    this.productService
        .update(
            this.productoEditandoId,
            request
        )
        .subscribe({

            next: () => {

                this.guardandoProducto = false;

                this.mostrarFormulario = false;

                this.productoEditandoId = null;

                this.modoEdicion = false;

                this.cargarProductos();

            },

            error: (error: unknown) => {

                console.error(
                    'Error al actualizar producto:',
                    error
                );

                this.formErrorMessage =
                    'No fue posible actualizar el producto.';

                this.guardandoProducto = false;

            }

        });

}
}