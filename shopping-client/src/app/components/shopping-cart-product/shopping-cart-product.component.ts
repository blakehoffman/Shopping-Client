import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartProductDTO } from 'src/app/dtos/cart-product-dto';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
    selector: 'app-shopping-cart-product',
    templateUrl: './shopping-cart-product.component.html',
    styleUrls: ['./shopping-cart-product.component.css']
})
export class ShoppingCartProductComponent implements OnInit {
    @Input() product: CartProductDTO | undefined;
    
    constructor(
        private _cartService: CartService,
        private _router: Router) { }

    ngOnInit(): void {
    }

    deleteProduct(): void {
        this._cartService.deleteProductFromCart(this.product!).subscribe();
    }

    increaseProductQuantity(quantity: number, productId: string): void {
        this._cartService.updateProductQuantity(productId, quantity);
    }

    navigateToProductPage() {
        this._router.navigate(['/products/', this.product?.id], { state: { product: this.product } });
    }
}
