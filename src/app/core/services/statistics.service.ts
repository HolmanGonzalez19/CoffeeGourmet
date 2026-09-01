import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Statistics } from '../models/statistics.model';

@Injectable({
    providedIn: 'root'
})
export class StatisticsService {

    private readonly http = inject(HttpClient);

    private readonly endpoint =
        '/api/statistics';

    getStatistics(): Observable<Statistics> {

        return this.http.get<Statistics>(
            this.endpoint
        );
    }
}