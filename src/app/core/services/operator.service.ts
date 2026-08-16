import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Operator } from '../models/operator.model';

@Injectable({
  providedIn: 'root'
})
export class OperatorService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = '/api/users/operators';

 /* getOperators(): Observable<Operator[]> {
    return this.http.get<Operator[]>(this.apiUrl).pipe(
      map(users =>
        users.filter(user =>
          user.activo && user.rolNombre === 'OPERADOR'
        )
      )
    );
  }*/

  getOperators(): Observable<Operator[]> {
  return this.http.get<Operator[]>(
    '/api/users/operators'
  );
}
}