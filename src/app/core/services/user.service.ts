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


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly http = inject(HttpClient);

  private readonly endpoint = '/api/users/operators';


  getActive(): Observable<Operator[]> {

    return this.http.get<Operator[]>(
      this.endpoint
    );

  }

}