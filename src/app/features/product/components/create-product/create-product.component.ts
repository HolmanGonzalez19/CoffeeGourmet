import { CommonModule } from "@angular/common";
import { Component, HostListener, inject, OnInit, ViewChild } from "@angular/core";
import { FormsModule, NgModel } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { CreateProductRequest, Product, ProductForm, ProductTypes, UpdateProductRequest } from "../../../../core/models/product.model";
import { Categories } from "../../../../core/models/categories.model";
import { CategoriesService } from "../../../../core/services/categories.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { MatInputModule } from "@angular/material/input";
import { ProductService } from "../../../../core/services/product.service";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@Component({
    templateUrl: './create-product.component.html',
    styleUrl: './create-product.component.scss',
    selector: 'app-create-product',
    standalone: true,

    imports: [
        MatButtonModule,
        CommonModule,
        FormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatSlideToggleModule
    ]
})
export class CreateProductComponent implements OnInit{

    private readonly dialogRef = inject(MatDialogRef<CreateProductComponent>);
    private readonly categoriesService = inject(CategoriesService);
    private readonly productService = inject(ProductService);
    private readonly notificationService = inject(NotificationService);
    private readonly data = inject<Product | null>(MAT_DIALOG_DATA);

    @ViewChild('nombre') nombreControl!: NgModel;
    @ViewChild('cate') categoriaIdControl!: NgModel;
    @ViewChild('tip') tipoProductoControl!: NgModel;
    @ViewChild('codigoBarr') codigoBarrasControl!: NgModel;
    @ViewChild('stockMin') stockMinimoControl!: NgModel;
    @ViewChild('compra') precioCompraControl!: NgModel;
    @ViewChild('venta') precioVentaControl!: NgModel;

    private scannerBuffer = '';
    private scannerLastKeyTime = 0;
    modoEdicion : boolean = false;
    guardandoProducto : boolean = false;
    codigoBarrasHabilitado : boolean = false;
    codigoBarrasError = false;
    precioCompraError = false;
    mostrartoggle: boolean = true;
    loading : boolean = false;
    categorias: Categories[] = [];
    tiposProducto:  ProductTypes[] = [];
    imagenSeleccionada: File | null = null;
    imagenPreview: string | null = null;
    imagenActual: string | null = null;
    imagenError = '';
    productoForm : ProductForm = {
        nombre: '',
        categoriaId: null,
        tipoProducto: null,
        codigoBarras: null,
        stockMinimo: null,
        descripcion: null,
        precioCompra: null,
        precioVenta: null
    };

    ngOnInit(): void {
        this.modoEdicion = !!this.data;
        this.getCategories();
        this.getProductTypes();
        if (this.modoEdicion) {
            this.cargarProductoParaEdicion();
        }
    }

    getCategories(){
        this.loading = true;
        this.categoriesService.getCategories().subscribe({
            next: data => {
          this.categorias = data;
          this.loading = false;
        },
        error: error => {
            this.categorias = [];
            this.loading = false;
            const message = error?.error?.message ??
                'No fue posible consultar las categorias.';
            this.notificationService.warning(message);
        }
      });
    }

    getProductTypes(){
        this.loading = true;
        this.productService.getProductTypes().subscribe({
            next: data => {
          this.tiposProducto = data;
          this.loading = false;
        },
        error: error => {
            this.tiposProducto = [];
            this.loading = false;
            const message = error?.error?.message ??
                'No fue posible consultar lo tipos de producto.';
            this.notificationService.warning(message);
        }
      });
    }

    cerrarModal(): void {
        if (this.guardandoProducto) {
            return;
        }
        this.dialogRef.close(true);
    }

    validarProducto(nombre: NgModel, categoria: NgModel, tipo: NgModel, stockMinimo: NgModel, codigoBarras: NgModel): void {

        // ==========================================================
        // VALIDACIONES
        // ==========================================================

        nombre.control.markAsTouched();
        categoria.control.markAsTouched();
        tipo.control.markAsTouched();
        stockMinimo.control.markAsTouched();
        codigoBarras.control.markAsTouched();

        this.codigoBarrasError = this.codigoBarrasHabilitado && !this.productoForm.codigoBarras;

        if (nombre.invalid || categoria.invalid || tipo.invalid || stockMinimo.invalid || this.codigoBarrasError) {
            this.notificationService.error('Diligencia los campos obligatorios.');
            return;
        }

        if (this.modoEdicion) {
            this.precioCompraError = (this.productoForm.precioCompra === null || this.productoForm.precioCompra === undefined);
            if ( (this.productoForm.precioCompra === null || this.productoForm.precioCompra === undefined) ||
                 ( this.productoForm.precioVenta === null || this.productoForm.precioVenta === undefined )
            ) {
                this.notificationService.error('Diligencia los campos obligatorios.');
                return;
            }else if (this.productoForm.precioCompra < 0) {
                this.notificationService.warning('El precio de compra no puede ser negativo.');
                return;
            }else if (this.productoForm.precioVenta <= 0) {
                this.notificationService.warning('El precio de venta debe ser mayor que cero.');
                return;
            }else{
                this.precioCompraError=false;
            }
        }

        this.modoEdicion ? this.guardarEdicion() : this.guardarProducto() ;
    }

    guardarProducto(){        
        this.guardandoProducto = true;
        const request: CreateProductRequest = this.llenarDatos();

        this.productService.create(request).subscribe({
                next: () => {
                    this.guardandoProducto = false;
                    this.notificationService.success('Producto Guardado Exitosamente.');
                    this.limpiarDatos();
                },
                error: (error: unknown) => {
                    this.guardandoProducto = false;
                    this.notificationService.error('No fue posible crear el producto.');
                }
            });
    }

    private guardarEdicion(): void {
        this.guardandoProducto = true;
        const request: UpdateProductRequest = this.llenarDatos();
        this.productService.update(this.data!.id, request).subscribe({
            next: () => {
                if (!this.imagenSeleccionada) {
                    this.guardandoProducto = false;
                    this.notificationService.success( 'Producto Actualizado Exitosamente.' );
                    this.dialogRef.close(true);
                    return;
                }

                this.productService.uploadProductImage(
                    this.data!.id,
                    this.imagenSeleccionada
                ).subscribe({
                    next: () => {
                        this.guardandoProducto = false;
                        this.notificationService.success( 'Producto Actualizado Exitosamente.' );
                        this.dialogRef.close(true);
                    },
                    error: () => {
                        this.guardandoProducto = false;
                        this.notificationService.error( 'El producto se actualizó, pero no fue posible guardar la imagen.' );
                    }
                });
            },
            error: () => {
                this.guardandoProducto = false;
                this.notificationService.error( 'No fue posible actualizar el producto.' );
            }
        });
    }

    llenarDatos(){
         return {
            nombre: this.productoForm.nombre.trim(),
            categoriaId: this.productoForm.categoriaId!,
            tipoProducto: this.productoForm.tipoProducto!,
            stockMinimo: this.productoForm.stockMinimo!,
            codigoBarras:
            this.productoForm.codigoBarras?.trim() || null,
            descripcion:
            this.productoForm.descripcion?.trim() || null,
            precioCompra: this.modoEdicion ? this.productoForm.precioCompra : 0,
            precioVenta: this.modoEdicion ? this.productoForm.precioVenta : 0
        };
    }

    cambiarEstadoCodigoBarras(habilitado: boolean): void {
        this.codigoBarrasHabilitado = habilitado;

        if (!habilitado) {
            this.productoForm.codigoBarras = null;
            this.scannerBuffer = '';
        }
    }

    private cargarProductoParaEdicion(): void {
        this.mostrartoggle = false;
        if (!this.data) {
            return;
        }

        this.productoForm = {
            nombre: this.data.nombre,
            categoriaId: this.data.categoriaId,
            tipoProducto: this.data.tipoProducto,
            codigoBarras: this.data.codigoBarras,
            stockMinimo: this.data.stockMinimo,
            descripcion: this.data.descripcion,
            precioCompra: this.data.precioCompra,
            precioVenta: this.data.precioVenta
        };
        this.imagenActual = this.data.imagen;

        this.codigoBarrasHabilitado = false;
    }

    @HostListener('document:keydown', ['$event'])
        onGlobalKeyDown(event: KeyboardEvent): void {
        if (!this.codigoBarrasHabilitado) {
            return;
        }

        const now = Date.now();
        const timeSinceLastKey =
            now - this.scannerLastKeyTime;

        if (timeSinceLastKey > 100) {
            this.scannerBuffer = '';
        }

        this.scannerLastKeyTime = now;

        if (event.key === 'Enter') {
            if (this.scannerBuffer.length > 0) {
                event.preventDefault();
                event.stopPropagation();
                const codigoBarras = this.scannerBuffer.trim();

                this.scannerBuffer = '';

                if (codigoBarras) {
                    this.productoForm.codigoBarras =
                        codigoBarras;
                    this.codigoBarrasError = false;
                }

                return;
            }

            return;
        }

        if (
            event.key === 'Shift' ||
            event.key === 'Control' ||
            event.key === 'Alt' ||
            event.key === 'Tab' ||
            event.key === 'Escape'
        ) {
            return;
        }

        if (event.key.length === 1) {
            this.scannerBuffer += event.key;
        }
    }

    limpiarDatos(){
        this.productoForm = {
            nombre: '',
            categoriaId: null,
            tipoProducto: null,
            codigoBarras: null,
            stockMinimo: null,
            descripcion: null,
            precioCompra: null,
            precioVenta: null
        };

        this.nombreControl?.reset('');
        this.categoriaIdControl?.reset(null);
        this.tipoProductoControl?.reset(null);
        this.codigoBarrasControl?.reset(null);
        this.stockMinimoControl?.reset(null);
        this.precioCompraControl?.reset(null);
        this.precioVentaControl?.reset(null);
    }

    obtenerUrlImagen(imagen: string): string {
        return `/api/products/images/${encodeURIComponent(imagen)}`;
    }

    onImagenSeleccionada(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.imagenError = '';

        if (!input.files || input.files.length === 0) {
            this.imagenSeleccionada = null;
            return;
        }

        const file = input.files[0];
        const tiposPermitidos = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ];
        const maximoBytes = 5 * 1024 * 1024;

        if (!tiposPermitidos.includes(file.type)) {
            this.imagenSeleccionada = null;
            input.value = '';
            this.imagenError =
                'El formato de imagen no es válido. Use JPG, PNG o WEBP.';
            return;
        }
        
        if (file.size > maximoBytes) {
            this.imagenSeleccionada = null;
            input.value = '';
            this.imagenError =
                'La imagen no puede superar los 5 MB.';
            return;
        }

        this.imagenSeleccionada = file;

        if (this.imagenPreview) {
            URL.revokeObjectURL(this.imagenPreview);
        }

        this.imagenPreview = URL.createObjectURL(file);
    }
}