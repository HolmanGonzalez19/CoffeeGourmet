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
import { CreateInventoryMovementRequest, Inventory, InventoryReference, RegisterMovementData } from "../../../../../core/models/inventory.model";
import { NotificationService } from "../../../../../core/services/notification.service";
import { InventoryService } from "../../../../../core/services/inventory.service";

@Component({
    templateUrl: './register-moviment.component.html',
    styleUrl: './register-moviment.component.scss',
    selector: 'app-register-moviment',
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
export class RegisterMovimentComponent implements OnInit{

    private readonly dialogRef = inject(MatDialogRef<RegisterMovimentComponent>);
    private readonly inventoryService = inject(InventoryService);
    private readonly notificationService = inject(NotificationService);
    private readonly data = inject<RegisterMovementData | null>(MAT_DIALOG_DATA);


    movimientoError: string = '';
    mostrarMovimiento: boolean = false;
    productoSeleccionado: Inventory | null = null;  
    loading: boolean = false;
    errorMessage = '';
    inventario: Inventory[] = [];
    referencias: InventoryReference[] = [];
    guardandoMovimiento : boolean = false;    
    movimientoForm: CreateInventoryMovementRequest = {
        productoId: 0,
        usuarioId: 0,
        tipoMovimiento: null,
        cantidad: 0,
        motivo: null,
        compraId: null
      };

      nombreproducto: string = '';

    ngOnInit(): void {
        this.nombreproducto = this.data?.item.productoNombre ?? this.data?.item.productoNombre ?? '';
        this.cargarReferencias();
    }

    cerrarModal(): void {
        if (this.guardandoMovimiento) {
            return;
        }
        this.dialogRef.close(true);
    }

    cargarReferencias(): void {

    this.inventoryService
      .getReferences()
      .subscribe({
        next: (referencias: InventoryReference[]) => {
          this.referencias = referencias;
        },

        error: (error: unknown) => {
          console.error(
            'Error al cargar referencias:',
            error
          );

        }

      });

  }

   validarMovimiento(movimiento: NgModel, referencia: NgModel): void {

        // ==========================================================
        // VALIDACIONES
        // ==========================================================

        movimiento.control.markAsTouched();
        referencia.control.markAsTouched();

        if (movimiento.invalid || referencia.invalid) {
            this.notificationService.error('Diligencia los campos obligatorios.');
            return;
        }

        this.guardarMovimiento();
    }

    guardarMovimiento(): void {
        this.movimientoError = '';
        // ----------------------------------------------------------
        // TIPO DE MOVIMIENTO
        // ----------------------------------------------------------
    
        if (!this.movimientoForm.tipoMovimiento) {
            this.notificationService.error('Debe seleccionar el tipo de movimiento.');
            return;
        }
    
        // ----------------------------------------------------------
        // CANTIDAD
        // ----------------------------------------------------------
    
        if ( !this.movimientoForm.cantidad || this.movimientoForm.cantidad < 1 ) {
            this.notificationService.error('La cantidad debe ser mayor que cero.');
            return;
        }    
    
        // ----------------------------------------------------------
        // COMPRA PARA ENTRADA
        // ----------------------------------------------------------
    
        if ( this.movimientoForm.tipoMovimiento === 'ENTRADA' && !this.movimientoForm.compraId ) {
            this.notificationService.error('Debe seleccionar una compra.');    
            return;    
        }
    
        // ----------------------------------------------------------
        // GUARDAR
        // ----------------------------------------------------------
    
        this.guardandoMovimiento = true;
    
        if (this.data?.item.productoId == null) {
        this.notificationService.error('El producto no tiene un ID válido.');
        return;
        }
        if (this.data?.movimientoForm.usuarioId == null) {
        this.notificationService.error('El usuario no tiene un ID válido.');
        return;
        }

        if (this.data?.movimientoForm.cantidad == null) {
        this.notificationService.error('La cantidad no tiene un ID válido.');
        return;
        }

        const request: CreateInventoryMovementRequest = {
            productoId: this.data.item.productoId,
            usuarioId: this.data.movimientoForm.usuarioId,
            tipoMovimiento: this.movimientoForm.tipoMovimiento,
            cantidad: this.movimientoForm.cantidad,
            motivo: this.movimientoForm.motivo,
            compraId: this.movimientoForm.compraId            
        };
    
        this.inventoryService
            .createMovement(request)
            .subscribe({
            next: () => {
                this.guardandoMovimiento = false;
                this.mostrarMovimiento = false;
                this.productoSeleccionado = null;
                this.notificationService.success('Se registro correctamente el movimiento.');
            },
            error: (error: unknown) => {
                console.error(
                'Error al registrar movimiento:',
                error
                );
    
                this.movimientoError =
                'No fue posible registrar el movimiento.';
    
                this.guardandoMovimiento = false;
            }
            });
        }
}