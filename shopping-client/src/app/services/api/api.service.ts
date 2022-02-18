import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AddCartProductDTO } from 'src/app/dtos/add-cart-product-dto';
import { HttpResultDTO } from 'src/app/dtos/http-result-dto';
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

    private handleError(error: any): Observable<any> {
        this._alertService.error(error.message)
        return throwError(error);
    }

    addProductToCart(cartID: string, addCartProductDTO: AddCartProductDTO): Observable<HttpResultDTO> {
        return this._httpService.post(`${this._apiUrl}carts/${cartID}/products/add`, JSON.stringify(addCartProductDTO))
            .pipe(
                tap(data => {
                    return data;
                }),
                catchError((error) => {
                    return this.handleError(error);
                })
            );
    }

    createCart(id: string): Observable<any> {
        return this._httpService.post(`${this._apiUrl}carts/create`, id)
            .pipe(
                tap(data => {
                    return data;
                }),
                catchError((error) => {
                    return this.handleError(error);
                })
            );
    }

    getCart(): Observable<any> {
        return this._httpService.get(`${this._apiUrl}carts`)
            .pipe(
                tap(data => {
                    return data;
                }),
                catchError((error) => {
                    return this.handleError(error);
                })
            );
    }

    getProduct(productId: string): Observable<any> {
        return this._httpService.getUnauthorized(`${this._apiUrl}products/${productId}`)
            .pipe(
                tap(data => {
                    return data;
                }),
                catchError((error) => {
                    return this.handleError(error);
                })
            );
    }

    getProducts(categoryId?: string): Observable<any> {
        let urlParams = '';

        if (categoryId) {
            urlParams = `?categoryId=${categoryId}`;
        }

        return this._httpService.getUnauthorized(`${this._apiUrl}products${urlParams}`)
            .pipe(
                tap(data => {
                    return data;
                }),
                catchError((error) => {
                    return this.handleError(error);
                })
            );
    }

    deleteCartProduct(cartID: string, productID: string) {
        return this._httpService.post(`${this._apiUrl}carts/${cartID}/products/delete`, productID)
            .pipe(
                tap(data => {
                    return data;
                }),
                catchError((error) => {
                    return this.handleError(error);
                })
            );
    }
}
