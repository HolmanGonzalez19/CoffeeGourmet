import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  usuario: string;
  password: string;
}

export interface PinLoginRequest {
  usuario: string;
  pin: string;
}

export interface AuthenticationResponse {
  token: string;
  usuarioId: number;
  nombre: string;
  usuario: string;
  rolId: number;
  rolNombre: string;
  permisos: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly endpoint = '/api/auth';

  private readonly tokenKey =
    'coffeeGourmetToken';

  private readonly userKey =
    'coffeeGourmetUser';


  // ============================================================
  // LOGIN ADMINISTRADOR
  // ============================================================

  login(
    request: LoginRequest
  ): Observable<AuthenticationResponse> {

    return this.http.post<AuthenticationResponse>(
      `${this.endpoint}/login`,
      request
    );

  }


  // ============================================================
  // LOGIN OPERADOR MEDIANTE PIN
  // ============================================================

  loginWithPin(
    request: PinLoginRequest
  ): Observable<AuthenticationResponse> {

    return this.http.post<AuthenticationResponse>(
      `${this.endpoint}/pin`,
      request
    );

  }


  // ============================================================
  // GUARDAR SESIÓN ADMINISTRATIVA
  // ============================================================

  saveSession(
    response: AuthenticationResponse
  ): void {

    localStorage.setItem(
      this.tokenKey,
      response.token
    );

    localStorage.setItem(
      this.userKey,
      JSON.stringify(response)
    );

  }


  // ============================================================
  // TOKEN ADMINISTRADOR
  // ============================================================

  getToken(): string | null {

    return localStorage.getItem(
      this.tokenKey
    );

  }


  // ============================================================
  // USUARIO ADMINISTRADOR ACTUAL
  // ============================================================

  getCurrentUser():
    AuthenticationResponse | null {

    const user =
      localStorage.getItem(
        this.userKey
      );

    if (!user) {

      return null;

    }

    try {

      return JSON.parse(
        user
      ) as AuthenticationResponse;

    } catch {

      this.clearSession();

      return null;

    }

  }


  // ============================================================
  // VALIDAR SESIÓN ADMINISTRATIVA
  // ============================================================

  isAdminSessionActive(): boolean {

    return this.getToken() !== null &&
           this.getCurrentUser() !== null;

  }


  // ============================================================
  // CERRAR SESIÓN ADMINISTRATIVA
  // ============================================================

  logout(): void {

    this.clearSession();

  }


  // ============================================================
  // LIMPIAR SESIÓN ADMINISTRATIVA
  // ============================================================

  private clearSession(): void {

    localStorage.removeItem(
      this.tokenKey
    );

    localStorage.removeItem(
      this.userKey
    );

  }

}