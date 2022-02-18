import { Injectable } from '@angular/core';
import { CartDTO } from 'src/app/dtos/cart-dto';

import { CartProductDTO } from 'src/app/dtos/cart-product-dto';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { v4 } from 'uuid';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { AlertService } from '../alert/alert.service';
import { AddCartProductDTO } from 'src/app/dtos/add-cart-product-dto';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    cartId: string | undefined;
    products: Array<CartProductDTO> = [];

    constructor(
        private _alertService: AlertService,
        private _apiService: ApiService,
        private _authService: AuthService) {
        this.loadCart();
    }


    private handleError(error: any): Observable<any> {
        this._alertService.error(error.message)
        return throwError(error);
    }

    private createCart(): Observable<boolean> {
        let newCartId = v4();

        return this._apiService.createCart(newCartId)
            .pipe(
                tap(data => {
                    if (data.succeeded) {
                        this.cartId = newCartId;

                        return true;
                    }

                    this._alertService.error(data.errors.join('\n'));
                    return false;
                }),
                catchError((error) => {
                    return this.handleError(error);
                })
            );
    }

    private getUserCart(): Observable<CartDTO> {
        return this._apiService.getCart()
            .pipe(
                tap(data => {
                    return data;
                }),
                catchError((error) => {
                    return this.handleError(error);
                })
            );
    }

    private loadCart(): void {
        let cartString = localStorage.getItem("cart");

        if (!cartString) {
            return;
        }

        let cart: CartDTO = JSON.parse(cartString);
        this.cartId = cart.id;
        this.products = cart.products;
    }

    addProductToCart(cartProductToAdd: CartProductDTO): Observable<any> {
        //if current user's cart isn't fetched, fetch it if they are logged in
        if (this.cartId == undefined && this._authService.isLoggedIn) {
            this.getUserCart().subscribe(cart => {
                if (cart) {
                    this.cartId = cart.id;
                    this.products = cart.products;
                }
            });
        }

        let addCartProductDTO: AddCartProductDTO = {
            id: cartProductToAdd.id,
            quantity: cartProductToAdd.quantity
        };

        //if they are logged in, add product to cart on backend
        if (this._authService.isLoggedIn) {
            return this._apiService.addProductToCart((this.cartId as string), addCartProductDTO).pipe(
                tap(result => {
                    if (!result.succeeded) {
                        this._alertService.error(result.errors.join('\n'));
                    }
                }),    
                catchError((error) => { return this.handleError(error) })
            );
        }

        let cartProduct = this.products.find(product => product.id == cartProductToAdd.id);

        //if product already exists in cart, don't add duplicate.  Just add new quantity
        if (cartProduct) {
            cartProduct.quantity += cartProductToAdd.quantity;
        }
        else {
            this.products.push(cartProductToAdd);
        }

        return of();
    }

    getUserCartAndMergeExistingCart(): void {
        let userCart: CartDTO | undefined;

        this.getUserCart().subscribe(cart => {
            if (cart) {
                userCart = cart;
            }
        });

        if (!userCart) {
            let userCartCreated = this.createCart();
        }
    }

    removeProductFromCart(cartProductToRemove: CartProductDTO): void {
        let cartProduct = this.products.find(product => product.id == cartProductToRemove.id);

        if (cartProduct) {
            this.products.splice(this.products.indexOf(cartProduct), 1);
        }
    }
}
