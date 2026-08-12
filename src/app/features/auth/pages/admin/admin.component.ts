import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  template: `
    <section>
      <h1>Administración</h1>

      <p>
        Sesión iniciada como:
        {{ authService.getCurrentUser()?.nombre }}
      </p>

      <button type="button" (click)="logout()">
        Cerrar sesión
      </button>
      <button type="button" (click)="volverAlPos()">
        Volver al POS
        </button>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  volverAlPos(): void {
  this.router.navigate(['/']);
}
}