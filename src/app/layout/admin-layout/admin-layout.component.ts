import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
    Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

  readonly authService = inject(AuthService);
  private readonly router = inject(Router);    
  private readonly notificationService = inject(NotificationService);

  logout(): void {
      this.authService.logout();
      this.router.navigate(['/']);
  }
}