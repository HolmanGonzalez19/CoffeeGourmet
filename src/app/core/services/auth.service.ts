import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  AuthUser,
  AuthenticationResponse,
  LoginRequest,
  PinLoginRequest
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly authEndpoint = '/api/auth';

  private readonly tokenKey = 'coffeeGourmet_token';
  private readonly userKey = 'coffeeGourmet_user';

  login(request: LoginRequest): Observable<AuthenticationResponse> {
    return this.http
      .post<AuthenticationResponse>(
        `${this.authEndpoint}/login`,
        request
      )
      .pipe(
        tap(response => this.saveSession(response))
      );
  }

  loginPin(request: PinLoginRequest): Observable<AuthenticationResponse> {
    return this.http
      .post<AuthenticationResponse>(
        `${this.authEndpoint}/pin`,
        request
      )
      .pipe(
        tap(response => this.saveSession(response))
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): AuthUser | null {
    const user = localStorage.getItem(this.userKey);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as AuthUser;
    } catch {
      this.logout();
      return null;
    }
  }

  hasPermission(permission: string): boolean {
    return this.getCurrentUser()?.permisos.includes(permission) ?? false;
  }

  hasRole(role: string): boolean {
    return this.getCurrentUser()?.rolNombre === role;
  }

  private saveSession(response: AuthenticationResponse): void {
    const user: AuthUser = {
      usuarioId: response.usuarioId,
      nombre: response.nombre,
      usuario: response.usuario,
      rolId: response.rolId,
      rolNombre: response.rolNombre,
      permisos: response.permisos
    };

    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(
      this.userKey,
      JSON.stringify(user)
    );
  }
}