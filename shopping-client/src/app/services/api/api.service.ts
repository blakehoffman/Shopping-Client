import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertService } from '../alert/alert.service';
import { HttpService } from '../http/http.service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private readonly _apiUrl = `${environment.baseUrl}`;

    constructor(
        private _alertService: AlertService,
        private _httpService: HttpService) { }

    createCart(id: string): Observable<any> {
        return this._httpService.post(`${this._apiUrl}carts/create`, id);
    }

    getCart(): Observable<any> {
        return this._httpService.get(`${this._apiUrl}carts`);
    }

    getProduct(productId: string): Observable<any> {
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
