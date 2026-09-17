import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, HostListener, inject, OnInit } from "@angular/core";
import { FormsModule, NgModel } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { SupplierService } from "../../../core/services/supplier.service";
import { NotificationService } from "../../../core/services/notification.service";
import { CreateSupplierRequest, GetSuppliers, SuppliersForm, UpdateSupplierRequest } from "../../../core/models/supplier.model";

@Component({
    templateUrl: './create-supplier.component.html',
    styleUrl: './create-supplier.component.scss',
    selector: 'app-create-supplier',
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
export class CreateSupplierComponent implements OnInit{

    private readonly dialogRef = inject(MatDialogRef<CreateSupplierComponent>);
    private readonly supplierService = inject(SupplierService);
    private readonly notificationService = inject(NotificationService);
    private readonly data = inject<GetSuppliers | null>(MAT_DIALOG_DATA);

    modoEdicion : boolean = false;
    guardandoSuppliers : boolean = false;
    errorMessage: string = '';
    loading : boolean = false;
    suppliersForm : SuppliersForm = {
        nombre: null,
        contacto:  null,
        telefono:  null,
        correo:  null,
        direccion:  null,
        observacion:  null,
        activo: true
    };

    ngOnInit(): void {
        this.modoEdicion = !!this.data;
        if (this.modoEdicion) {
            this.cargarProveedorParaEdicion();
        }
    }

    cerrarModal(): void {
        if (this.guardandoSuppliers) {
            return;
        }
        this.dialogRef.close(true);
    }

    validarProveedor(nombre: NgModel): void {

        // ==========================================================
        // VALIDACIONES
        // ==========================================================

        nombre.control.markAsTouched();

        if (nombre.invalid) {
            this.notificationService.error('Diligencia los campos obligatorios.');
            return;
        }

        this.modoEdicion ? this.guardarEdicion() : this.guardarProveedor() ;
    }

    guardarProveedor(){        
        this.guardandoSuppliers = true;
        const request: CreateSupplierRequest = this.llenarDatos();

        this.supplierService.create(request).subscribe({
                next: () => {
                    this.guardandoSuppliers = false;
                    this.notificationService.success('Proveedor Guardado Exitosamente.');
                },
                error: error => {
                    this.guardandoSuppliers = false;
                    this.errorMessage =
                    error.error?.message ??
                    'No fue posible crear el proveedor.';
                    this.notificationService.error(this.errorMessage);
                    
                    this.loading = false;
                    }
            });
    }

    private guardarEdicion(): void {
        this.guardandoSuppliers = true;
        const request: UpdateSupplierRequest=  this.llenarDatos();
        this.supplierService.update(this.data!.id, request).subscribe({
                next: () => {
                    this.guardandoSuppliers = false;
                    this.notificationService.success('Proveedor Actualizado Exitosamente.');
                },
                error: error => {
                    this.errorMessage =
                    error.error?.message ??
                    'No fue posible actualizar el proveedor.';
                    this.notificationService.error(this.errorMessage);
                    this.guardandoSuppliers = false;
                }
            });
    }

    llenarDatos(){
         return {
            nombre: this.suppliersForm.nombre!.trim(),
            contacto: this.suppliersForm.contacto!,
            telefono: this.suppliersForm.telefono!,
            correo: this.suppliersForm.correo!,
            direccion: this.suppliersForm.direccion!,
            observacion: this.suppliersForm.observacion!,
            activo: this.suppliersForm.activo!
        };
    }

    private cargarProveedorParaEdicion(): void {
        if (!this.data) {
            return;
        }

        this.suppliersForm = {
            nombre: this.data.nombre,
            contacto: this.data.contacto,
            telefono: this.data.telefono,
            correo: this.data.correo,
            direccion: this.data.direccion,
            observacion: this.data.observacion,
            activo: this.data?.activo
        };
    }
}