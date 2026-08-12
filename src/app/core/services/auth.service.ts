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
  private readonly tokenKey = 'coffeeGourmetToken';
  private readonly userKey = 'coffeeGourmetUser';

  login(
    request: LoginRequest
  ): Observable<AuthenticationResponse> {

    return this.http.post<AuthenticationResponse>(
      `${this.endpoint}/login`,
      request
    );
  }

  loginWithPin(
    request: PinLoginRequest
  ): Observable<AuthenticationResponse> {

    return this.http.post<AuthenticationResponse>(
      `${this.endpoint}/pin`,
      request
    );
  }

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

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): AuthenticationResponse | null {

    const user = localStorage.getItem(this.userKey);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as AuthenticationResponse;
    } catch {
      this.clearSession();
      return null;
    }
  }

  logout(): void {
    this.clearSession();
  }

  private clearSession(): void {

    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }
}