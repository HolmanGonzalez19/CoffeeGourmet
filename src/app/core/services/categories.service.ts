import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Categories } from '../models/categories.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = '/api/categories';

  getCategories(): Observable<Categories[]> {
  return this.http.get<Categories[]>(
    this.apiUrl
  );
}
}