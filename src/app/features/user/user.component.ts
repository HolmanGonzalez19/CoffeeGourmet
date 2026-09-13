import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { NotificationService } from "../../core/services/notification.service";
import { Observable } from "rxjs";
import { UsersAdmin } from "../../core/models/user.model";
import { UserService } from "../../core/services/user.service";
import { CreateUsersComponent } from "./create-user/create-user.component";

@Component({
    selector: 'app-user',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatSelectModule,
        MatDatepickerModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatPaginatorModule
    ],
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss'
})
export class UsersComponent implements OnInit {

    private readonly dialog = inject(MatDialog);
    private readonly notificationService = inject(NotificationService);
    private readonly userService = inject(UserService);

    filtroEstado: string = '';
    filtroRol: string = '';
    loading: boolean = false;
    errorMessage:string = '';
    filtroBusqueda:string = '';
    filtroNombre: string = '';
    filtroUsuario: string = '';
    paginaActual = 0;
    registrosPorPagina = 10;
    totalRegistros = 0;
    usuariosFiltrados: UsersAdmin[] = [];
    usuarios: UsersAdmin[] = [];
    usuariosPaginados: UsersAdmin[] = [];

    ngOnInit(): void {
        this.cargarUsuarios();
    }

    obtenerTextoEstado( activo: boolean ): string {
        return activo ? 'Activo' : 'Inactivo';
    }

    crearUsuario(): void {
        const dialogRef = this.dialog.open(
            CreateUsersComponent,
            {
            width: '800px',
            maxWidth: 'calc(100vw - 50px)',
            height: '537px',
            disableClose: true,
            autoFocus: false,
            panelClass: 'create-product-dialog'
            }
        );
        dialogRef.afterClosed().subscribe((guardado: boolean) => {
            if (guardado) {
                this.cargarUsuarios();
            }
        });
    }

    editarUsuario(usuario: UsersAdmin): void {
        const dialogRef = this.dialog.open(
            CreateUsersComponent,
            {
            width: '800px',
            maxWidth: 'calc(100vw - 50px)',
            height: '537px',
            disableClose: true,
            autoFocus: false,
            panelClass: 'create-product-dialog',
            data: usuario
            }
        );

        dialogRef.afterClosed().subscribe((guardado: boolean) => {
            if (guardado) {
                this.cargarUsuarios();
            }
        });
    }

    // ============================================================
    // CARGAR USUARIOS
    // ============================================================
    
    cargarUsuarios(): void {
        this.loading = true;
        this.errorMessage = '';
        let request: Observable<UsersAdmin[]>;
        switch (this.filtroEstado) {
            case 'INACTIVOS':
                request = this.userService.getInactiveUsers();
                break;
            case '':
                request = this.userService.getAllUsers();
                break;
            case 'ACTIVOS':
            default:
                request = this.userService.getUsers();
                break;
        }
        
        request.subscribe({
            next: (usuario: UsersAdmin[]) => {
                this.usuarios = usuario;
                this.aplicarFiltros();
                this.loading = false;
            },
            error: (error: unknown) => {
                this.errorMessage = 'No fue posible cargar los usuarios.';
                this.notificationService.error('No fue posible cargar los usuarios')
                this.loading = false;
            }
        });
    }

    // ============================================================
    // APLICAR FILTROS
    // ============================================================

    aplicarFiltros(): void {
        const busqueda = this.filtroBusqueda.trim().toLowerCase();        
        this.usuariosFiltrados = this.usuarios.filter(usuario => {

            // --------------------------------------------------------
            // ESTADO
            // --------------------------------------------------------

            if ( this.filtroEstado === 'ACTIVOS' && !usuario.activo ) {
                return false;
            }
            if ( this.filtroEstado === 'INACTIVOS' && usuario.activo ) {
                return false;
            }

            // --------------------------------------------------------
            // ROL
            // --------------------------------------------------------

            if (this.filtroRol && usuario.rolNombre !== this.filtroRol) {
                return false;
            }

            // --------------------------------------------------------
            // BÚSQUEDA
            // --------------------------------------------------------

            if (busqueda) {
                const coincideBusqueda = usuario.nombre.toLowerCase().includes(busqueda)
                    || usuario.usuario.toLowerCase().includes(busqueda);
                if (!coincideBusqueda) {
                    return false;
                }
            }


            // --------------------------------------------------------
            // NOMBRE
            // --------------------------------------------------------

            if (this.filtroNombre && usuario.nombre !== this.filtroNombre) {
                return false;
            }

            // --------------------------------------------------------
            // USUARIO
            // --------------------------------------------------------

            if ( this.filtroUsuario && usuario.usuario !== this.filtroUsuario) {
                return false;
            }

            return true;
        });

        // ============================================================
        // ACTUALIZAR PAGINACIÓN
        // ============================================================

        this.paginaActual = 0;
        this.totalRegistros = this.usuariosFiltrados.length;
        this.actualizarUsuariosPaginados();
    }

    // ============================================================
    // ACTUALIZAR USUARIOS DE LA PÁGINA
    // ============================================================

    private actualizarUsuariosPaginados(): void {
        const inicio = this.paginaActual * this.registrosPorPagina;
        const fin = inicio + this.registrosPorPagina;
        this.usuariosPaginados = this.usuariosFiltrados.slice( inicio, fin );
    }

    cambiarEstado(usuario: UsersAdmin): void {
        const accion = usuario.activo ? 'desactivar' : 'activar';
        const confirmado = window.confirm(
            `¿Está seguro de ${accion} el usuario "${usuario.nombre}"?`
        );

        if (!confirmado) {
            return;
        }

        this.loading = true;    
        this.errorMessage = '';
        const request$ = usuario.activo
            ? this.userService.deactivate(usuario.id)
            : this.userService.activate(usuario.id);

        request$.subscribe({    
            next: () => {    
                this.cargarUsuarios();    
            },    
            error: (error) => {
                console.error( `Error al ${accion} usuario:`, error );
                this.errorMessage = `No fue posible ${accion} el usuario.`;    
                this.loading = false;    
            }
        });
    }

    // ============================================================
    // LIMPIAR FILTROS
    // ============================================================

    limpiarFiltros(): void {

        this.filtroBusqueda = '';
        this.filtroNombre = '';
        this.filtroEstado = '';
        this.filtroRol = '';
        this.cargarUsuarios();

    }

    obtenerTotalPaginas(): number {
        if (this.totalRegistros === 0) {
            return 1;
        }

        return Math.ceil( this.totalRegistros / this.registrosPorPagina);
    }

    // ============================================================
    // CAMBIAR PÁGINA
    // ============================================================

    handlePageEvent(event: PageEvent): void {
        this.paginaActual = event.pageIndex;
        this.registrosPorPagina = event.pageSize;
        this.actualizarUsuariosPaginados();
    }
}