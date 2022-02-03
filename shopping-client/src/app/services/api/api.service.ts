import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http/http.service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private readonly apiUrl = `${environment.baseUrl}`;

    constructor(private httpService: HttpService) { }

    getProducts(categoryId?: string): Observable<any> {
        let urlParams = '';

        if (categoryId) {
            urlParams = `?categoryId=${categoryId}`;
        }

        return this.httpService.getUnauthorized(`${this.apiUrl}products${urlParams}`);
    }
}
