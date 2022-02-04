import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http/http.service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private readonly _apiUrl = `${environment.baseUrl}`;

    constructor(private _httpService: HttpService) { }

    getProduct(productId: string) {
        return this._httpService.getUnauthorized(`${this._apiUrl}products/${productId}`);
    }

    getProducts(categoryId?: string): Observable<any> {
        let urlParams = '';

        if (categoryId) {
            urlParams = `?categoryId=${categoryId}`;
        }

        return this._httpService.getUnauthorized(`${this._apiUrl}products${urlParams}`);
    }
}
