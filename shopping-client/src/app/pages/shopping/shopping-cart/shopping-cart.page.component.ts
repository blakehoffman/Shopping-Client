import { Component, OnInit } from '@angular/core';
import { CartProductDTO } from 'src/app/dtos/cart-product-dto';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
    selector: 'app-shopping-cart',
    templateUrl: './shopping-cart.page.component.html',
    styleUrls: ['./shopping-cart.page.component.css']
})
export class ShoppingCartPageComponent implements OnInit {
    products: Array<CartProductDTO> = [];

    constructor(private _cartService: CartService) {}

    ngOnInit(): void {
        this._cartService.productsChange
            .subscribe(products => this.products = products);
    }

}
