import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Roles } from "../models/roles.model";

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/roles';

  getRoleActive(): Observable<Roles[]> {

    return this.http.get<Roles[]>(
      this.endpoint
    );

  }
}