import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {  SaleResponse } from "../models/sale.model";

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  private readonly http = inject(HttpClient);

  private readonly endpoint = '/api/receipt';


  print(id: number): Observable<void> {

    return this.http.get<void>(
       `${this.endpoint}/${id}`
    );
  }
}