import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CartProductDTO } from 'src/app/dtos/cart-product-dto';
import { ProductDTO } from 'src/app/dtos/product-dto';
import { ApiService } from 'src/app/services/api/api.service';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
    selector: 'app-product.page',
    templateUrl: './product.page.component.html',
    styleUrls: ['./product.page.component.css']
})
export class ProductPageComponent implements OnInit {

    product: ProductDTO | undefined;
    quantity: number = 0;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _apiService: ApiService,
        private _cartService: CartService,
        private _router: Router) {
        this.product = this._router.getCurrentNavigation()?.extras?.state?.product;
    }

    ngOnInit(): void {
        let productId = this._activatedRoute.snapshot.paramMap.get('id');

        if (!this.product && productId) {
            this._apiService.getProduct(productId)
                .subscribe(result => this.product = result)
        }
    }

    increaseProductQuantity(quantity: number): void {
        this.quantity = quantity;
    }

    onAddToCart(): void {
        if (this.product == undefined) {
            return;
        }

        let cartProductDTO: CartProductDTO = {
            id: this.product.id,
            name: this.product.name,
            price: this.product.price,
            quantity: this.quantity 
        };

        this._cartService.addProductToCart(cartProductDTO).subscribe();
    }
}
