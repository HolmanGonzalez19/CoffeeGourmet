import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormsModule, NgModel } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { CreateUserRequest, UpdateUserRequest, UserForm, UsersAdmin } from "../../../core/models/user.model";
import { NotificationService } from "../../../core/services/notification.service";
import { UserService } from "../../../core/services/user.service";
import { RolesService } from "../../../core/services/roles.service";
import { Roles } from "../../../core/models/roles.model";

@Component({
    templateUrl: './create-user.component.html',
    styleUrl: './create-user.component.scss',
    selector: 'app-create-user',
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
export class CreateUsersComponent implements OnInit{

    private readonly dialogRef = inject(MatDialogRef<CreateUsersComponent>);
    private readonly notificationService = inject(NotificationService);
    private readonly userService = inject(UserService);
    private readonly rolesService = inject(RolesService);
    private readonly data = inject<UsersAdmin | null>(MAT_DIALOG_DATA);

    guardandoUsuario : boolean = false;
    modoEdicion : boolean = false;
    loading : boolean = false;
    hidePassword:boolean = true;
    roles :  Roles[] = [];
    userForm : UserForm = {
            nombre: '',
            usuario: '',
            password: '',
            pin: '',
            rol: null
        };

    ngOnInit(): void {
        this.modoEdicion = !!this.data;
        this.getRoles();
        if (this.modoEdicion) {
            this.cargarUsuarioParaEdicion();
        }
    }

    getRoles(){
        this.loading = true;
        this.rolesService.getRoleActive().subscribe({
            next: data => {
          this.roles = data;
          this.loading = false;
        },
        error: error => {
            this.roles = [];
            this.loading = false;
            const message = error?.error?.message ??
                'No fue posible consultar los roles.';
            this.notificationService.warning(message);
        }
      });
    }

    private cargarUsuarioParaEdicion(): void {
        if (!this.data) {
            return;
        }

        this.userForm = {
            nombre: this.data.nombre,
            usuario: this.data.usuario,
            rol: this.data.rolId,
            password: '',
            pin: '',
        };
    }

    cerrarModal(): void {
        if (this.guardandoUsuario) {
            return;
        }
        this.dialogRef.close(true);
    }

    validarUsuario(nombre: NgModel, usuario: NgModel, rol: NgModel): void {
        nombre.control.markAsTouched();
        usuario.control.markAsTouched();
        rol.control.markAsTouched();

        if ( nombre.invalid || usuario.invalid || rol.invalid ) {
            this.notificationService.error( 'Diligencia los campos obligatorios.' );
            return;
        }

        const password = this.userForm.password?.trim() ?? '';
        const pin = this.userForm.pin?.trim() ?? '';

        // ============================================================
        // CREDENCIALES
        // ============================================================

        if (!password && !pin && !this.modoEdicion) {
            this.notificationService.error('Debes ingresar una contraseña o un PIN.');
            return;
        }

        // ============================================================
        // VALIDACIÓN PASSWORD
        // ============================================================

        if (password) {

            if (
                password.length < 8 ||
                password.length > 20
            ) {
                this.notificationService.warning('La contraseña debe tener entre 8 y 20 caracteres.');
                return;
            }
        }


      // ============================================================
        // VALIDACIÓN PIN
        // ============================================================

        if (pin) {

            if (!/^\d{4}$/.test(pin)) {
                this.notificationService.warning(
                    'El PIN debe tener exactamente 4 dígitos numéricos.'
                );
                return;
            }

            if (/(\d)\1\1/.test(pin)) {
                this.notificationService.warning(
                    'El PIN no puede contener 3 o más números iguales consecutivos.'
                );
                return;
            }
        }

        this.modoEdicion ? this.guardarEdicion() : this.guardarUsuario() ;
    }

    guardarUsuario(){
        this.guardandoUsuario = true;
        const request: CreateUserRequest = this.llenarDatos();

        this.userService.create(request).subscribe({
                next: () => {
                    this.guardandoUsuario = false;
                    this.notificationService.success('Usuario Guardado Exitosamente.');
                },
                 error: error => {
                    this.guardandoUsuario = false;
                    const message = error?.error?.message ?? 'No fue posible crear el usuario.';
                    this.notificationService.error(message);
                }
            });
    }

    private guardarEdicion(): void {
        this.guardandoUsuario = true;
        const request: UpdateUserRequest = { ...this.llenarDatos(), activo: this.data!.activo };
        this.userService.update(this.data!.id, request).subscribe({
                next: () => {
                    this.guardandoUsuario = false;
                    this.notificationService.success('Usuario Actualizado Exitosamente.');
                },
                error: error => {
                    this.guardandoUsuario = false;
                    const message = error?.error?.message ?? 'No fue posible actualizar el usuario.';
                    this.notificationService.error(message);
                }
            });
    }

    llenarDatos(){
        return {
            nombre: this.userForm.nombre?.trim() ?? '',
            usuario: this.userForm.usuario?.trim() ?? '',
            password: this.userForm.password?.trim() || null,
            pin: this.userForm.pin?.trim() || null,
            rolId: this.userForm.rol
        };
    }
}