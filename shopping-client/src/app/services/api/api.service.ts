import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AddCartProductDTO } from 'src/app/dtos/add-cart-product-dto';
import { CartDTO } from 'src/app/dtos/cart-dto';
import { HttpResultDTO } from 'src/app/dtos/http-result-dto';
import { ProductDTO } from 'src/app/dtos/product-dto';
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

    private handleError(error: any, alertError: boolean): Observable<any> {
        if (alertError) {
            this._alertService.error(error.message)
        }

        return throwError(error);
    }

    addProductToCart(cartID: string, addCartProductDTO: AddCartProductDTO, alertError: boolean = true): Observable<HttpResultDTO> {
        return this._httpService.post(`${this._apiUrl}carts/${cartID}/products/add`, JSON.stringify(addCartProductDTO))
            .pipe(
                tap(data => {
                    return data;
                }),
                catchError((error) => {
                    return this.handleError(error, alertError);
                })
            );
    }

    createCart(id: string, alertError: boolean = true): Observable<HttpResultDTO> {
        return this._httpService.post(`${this._apiUrl}carts/create`, id)
            .pipe(
                tap(data => {
                    return data;
                }),
                catchError((error) => {
                    return this.handleError(error, alertError);
                })
            );
    }

    getCart(alertError: boolean = true): Observable<CartDTO> {
        return this._httpService.get(`${this._apiUrl}carts`)
            .pipe(
                tap(data => {
                    return data;
                }),
                catchError((error) => {
                    return this.handleError(error, alertError);
                })
            );
    }

    getProduct(productId: string, alertError: boolean = true): Observable<ProductDTO> {
        return this._httpService.getUnauthorized(`${this._apiUrl}products/${productId}`)
            .pipe(
                tap(data => {
                    return data;
                }),
                catchError((error) => {
                    return this.handleError(error, alertError);
                })
            );
    }

    getProducts(categoryId?: string, alertError: boolean = true): Observable<Array<ProductDTO>> {
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
                    return this.handleError(error, alertError);
                })
            );
    }

    deleteCartProduct(cartID: string, productID: string, alertError: boolean = true): Observable<HttpResultDTO> {
        return this._httpService.post(`${this._apiUrl}carts/${cartID}/products/delete`, productID)
            .pipe(
                tap(data => {
                    return data;
                }),
                catchError((error) => {
                    return this.handleError(error, alertError);
                })
            );
    }
}
