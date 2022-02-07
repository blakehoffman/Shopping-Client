import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProductDTO } from 'src/app/dtos/product-dto';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
    selector: 'product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
    @Input() product: ProductDTO | undefined;

    constructor(
        private _httpService: HttpService,
        private _router: Router) { }

    ngOnInit(): void {

    }

    navigateToProductPage() {
        this._router.navigate(['/products/', this.product?.id], { state: { product: this.product } });
    }

}
