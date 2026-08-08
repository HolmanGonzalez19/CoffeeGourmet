import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  usuario = '';
  password = '';

  loading = false;
  errorMessage = '';

  login(): void {
    if (!this.usuario.trim() || !this.password) {
      this.errorMessage = 'Ingrese usuario y contraseña.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({
      usuario: this.usuario.trim(),
      password: this.password
    }).subscribe({
      next: response => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: error => {
        this.loading = false;

        if (error.status === 401) {
          this.errorMessage = 'Usuario o contraseña incorrectos.';
          return;
        }

        if (error.status === 403) {
          this.errorMessage = 'El usuario no tiene permisos para acceder.';
          return;
        }

        this.errorMessage = 'No fue posible iniciar sesión.';
      }
    });
  }

  volverAlPos(): void {
    this.router.navigate(['/']);
  }
}