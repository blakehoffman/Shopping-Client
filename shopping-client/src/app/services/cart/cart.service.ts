import { Injectable } from '@angular/core';
import { CartDTO } from 'src/app/dtos/cart-dto';

import { CartProductDTO } from 'src/app/dtos/cart-product-dto';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { v4 } from 'uuid';
import { catchError, map, mergeMap, tap, } from 'rxjs/operators';
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

    private addProductToLocalCart(cartProduct: CartProductDTO): void {
        let foundProduct = this.products.find(product => product.id == cartProduct.id);

        //if product already exists in cart, don't add duplicate.  Just add new quantity
        if (foundProduct) {
            cartProduct.quantity += cartProduct.quantity;
        }
        else {
            this.products.push(cartProduct);
        }
    }

    private deleteProductFromLocalCart(cartProduct: CartProductDTO): void {
        this.products.splice(this.products.indexOf(cartProduct), 1);
        this.updateCartInLocalStorage();
    }

    private handleError(error: any): Observable<never> {
        this._alertService.error(error.message)
        return throwError(error);
    }

    private createCart(): Observable<boolean> {
        let newCartId = v4();

        return this._apiService.createCart(newCartId)
            .pipe(
                map(data => {
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

    private mergeCarts(userCart: CartDTO): void {
        for (let product of this.products) {
            let foundProduct = userCart.products.find(userCartProduct => userCartProduct.id == product.id);

            //only add products that don't exist in the saved user's cart so there are no duplicates
            if (!foundProduct) {
                userCart.products.push(product);
            }

            //save local products that were not attached to user account
            let addCartProductDTO: AddCartProductDTO = {
                id: product.id,
                quantity: product.quantity
            };

            this._apiService.addProductToCart((this.cartId as string), addCartProductDTO);
            this.updateCartInLocalStorage();
        }
    }

    private updateCartInLocalStorage() {
        let cart: CartDTO = {
            id: (this.cartId as string),
            products: this.products
        };

        let cartString = JSON.stringify(cart);
        localStorage.setItem('cart', cartString);
    }

    addProductToCart(cartProductToAdd: CartProductDTO): Observable<void> {
        let addCartProductDTO: AddCartProductDTO = {
            id: cartProductToAdd.id,
            quantity: cartProductToAdd.quantity
        };

        var observable = new Observable<void>((observer) => {
            //if current user's cart isn't fetched, fetch it if they are logged in
            if (this._authService.isLoggedIn) {
                if (this.cartId == undefined) {
                    this.getUserCart()
                        .pipe(
                            mergeMap((cart) => {
                                if (cart) {
                                    this.cartId = cart.id;
                                    this.products = cart.products;
                                }

                                return this._apiService.addProductToCart((this.cartId as string), addCartProductDTO);
                            }),
                            map(httpResult => {
                                if (!httpResult.succeeded) {
                                    this._alertService.error(httpResult.errors.join('\n'));
                                }

                                observer.complete();
                            }),
                            catchError((error) => {
                                observer.error(error);
                                return this.handleError(error)
                            })
                        ).subscribe();

                    this.addProductToLocalCart(cartProductToAdd);
                }
                else {
                    this._apiService.addProductToCart((this.cartId as string), addCartProductDTO)
                        .pipe(
                            map(httpResult => {
                                if (!httpResult.succeeded) {
                                    this._alertService.error(httpResult.errors.join('\n'));
                                }

                                observer.complete();
                            }),
                            catchError((error) => {
                                observer.error(error);
                                return this.handleError(error);
                            })
                    );

                    this.addProductToLocalCart(cartProductToAdd);
                }
            }
            else {
                this.addProductToLocalCart(cartProductToAdd);
                this.updateCartInLocalStorage();

                observer.complete();
            }
        });

        return observable;
    }

    //used for adding products to existing cart when user builds cart before signing in
    getUserCartAndMergeExistingCart(): Observable<void> {
        var observable = new Observable<void>((observer) => {
            this.getUserCart()
                .pipe(
                    mergeMap(userCart => {
                        if (userCart) {
                            this.mergeCarts(userCart);
                            return of(false);
                        }
                        else {
                            return this.createCart();
                        }
                    }),
                    tap(cartCreated => {
                        if (cartCreated) {
                            //save products to user's cart
                            for (let product of this.products) {
                                let addCartProductDTO: AddCartProductDTO = {
                                    id: product.id,
                                    quantity: product.quantity
                                };

                                this._apiService.addProductToCart((this.cartId as string), addCartProductDTO);
                            }
                        }

                        return observer.complete();
                    }),
                    catchError((error) => {
                        observer.error(error);
                        return this.handleError(error)
                    })
                );
        });

        return observable;
    }

    removeProductFromCart(cartProductToRemove: CartProductDTO): Observable<void> {
        let cartProduct = this.products.find(product => product.id == cartProductToRemove.id);

        var observable = new Observable<void>((observer) => {
            if (!cartProduct) {
                observer.complete();
                return;
            }

            if (this._authService.isLoggedIn) {
                //get cart if it isn't present
                if (this.cartId == undefined) {
                    this.getUserCart()
                        .pipe(
                            mergeMap((cart) => {
                                if (cart) {
                                    this.cartId = cart.id;
                                    this.products = cart.products;
                                }

                                return this._apiService.deleteCartProduct((this.cartId as string), cartProductToRemove.id);
                            }),
                            map(httpResult => {
                                if (!httpResult.succeeded) {
                                    this._alertService.error(httpResult.errors.join('\n'));
                                }

                                observer.complete();
                            }),
                            catchError((error) => {
                                observer.error(error);
                                return this.handleError(error)
                            })
                        );

                    this.deleteProductFromLocalCart(cartProductToRemove);
                    return;
                }
                else {
                    this._apiService.deleteCartProduct((this.cartId as string), cartProductToRemove.id)
                        .pipe(
                            tap(httpResult => {
                                if (!httpResult.succeeded) {
                                    this._alertService.error(httpResult.errors.join('\n'));
                                }

                                observer.complete();
                            }),
                            catchError((error) => {
                                observer.error(error);
                                return this.handleError(error)
                            })
                        );

                    this.deleteProductFromLocalCart(cartProductToRemove);
                    return;
                }
            }

            this.deleteProductFromLocalCart(cartProductToRemove);
            observer.complete();
        });

        return observable;
    }
}
