import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';
import { Operator } from '../models/operator.model';
import { CreateUserRequest, UpdateUserRequest, User, UsersAdmin } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly http = inject(HttpClient);

  private readonly endpoint = '/api/users';


  getActive(): Observable<Operator[]> {

    return this.http.get<Operator[]>(
      `${this.endpoint}/operators`
    );

  }

  getUsers(): Observable<UsersAdmin[]> {

    return this.http.get<UsersAdmin[]>(
      this.endpoint
    );

  }


  getInactiveUsers(): Observable<UsersAdmin[]> {

    return this.http.get<UsersAdmin[]>(
      `${this.endpoint}/inactivos`
    );

  }


  getAllUsers(): Observable<UsersAdmin[]> {

    return this.http.get<UsersAdmin[]>(
      `${this.endpoint}/all`
    );

  }

  activate(id: number): Observable<void> {

    return this.http.put<void>(
      `${this.endpoint}/${id}/activate`,
      {}
    );

  }


  deactivate(id: number): Observable<void> {

    return this.http.put<void>(
      `${this.endpoint}/${id}/deactivate`,
      {}
    );

  }

create(
    request: CreateUserRequest
  ): Observable<User> {

    return this.http.post<User>(
      this.endpoint,
      request
    );

  }

  update(id: number, request: UpdateUserRequest
  ): Observable<User> {
  
    return this.http.put<User>(
      `${this.endpoint}/${id}`,
      request
    );
  
  }

}