import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductDTO } from 'src/app/dtos/product-dto';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
    selector: 'app-product.page',
    templateUrl: './product.page.component.html',
    styleUrls: ['./product.page.component.css']
})
export class ProductPageComponent implements OnInit {

    product: ProductDTO | undefined;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _apiService: ApiService,
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

}
