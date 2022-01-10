import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private readonly apiUrl = 'https://localhost:44309/';

    constructor(private httpService: HttpService) { }

    getProducts(categoryId?: string): Observable<any> {
        return this.httpService.getUnauthorized(`${this.apiUrl}/products`);
    }
}
