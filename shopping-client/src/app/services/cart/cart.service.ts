import { Injectable } from '@angular/core';
import { CartDTO } from 'src/app/dtos/cart-dto';

import { CartProductDTO } from 'src/app/dtos/cart-product-dto';
import { AlertService } from '../alert/alert.service';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { v4 } from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    cart: CartDTO | undefined;

    constructor(
        private _alertService: AlertService,
        private _apiService: ApiService,
        private _authService: AuthService) {
        this.loadCart();
    }

    private createCart(): void {
        let id = v4();

        this._apiService.createCart(id)
            .subscribe()
    }

    private loadCart(): void {
        let cartString = localStorage.getItem("cart");
        
        if (!cartString) {
            return;
        }

        let cart: CartDTO = JSON.parse(cartString);
        this.cart = cart;
    }

    addProductToCart(cartProductToAdd: CartProductDTO): void {
        let cartProduct = this.cart.products.find(product => product.id == cartProductToAdd.id);

        //if product already exists in cart, don't add duplicate.  Just add new quantity
        if (cartProduct) {
            cartProduct.quantity += cartProductToAdd.quantity;
        }
        else {
            this.cart.products.push(cartProductToAdd);
        }
    }

    getUserCart(): void {
        if (this._authService.isLoggedIn) {
            this._apiService.getCart()
                .subscribe(result => this.cart = result)
        }
    }

    removeProductFromCart(cartProductToRemove: CartProductDTO): void {
        let cartProduct = this.cart.products.find(product => product.id == cartProductToRemove.id);

        if (cartProduct) {
            this.cart.products.splice(this.cart.products.indexOf(cartProduct), 1);
        }
    }
}
