import { Component, OnInit } from '@angular/core';
import { ProductDTO } from 'src/app/dtos/product-dto';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
    selector: 'app-products-page',
    templateUrl: './products.page.component.html',
    styleUrls: ['./products.page.component.css']
})
export class ProductsPageComponent implements OnInit {

    products: ProductDTO[] = [];

    constructor(
        private apiService: ApiService,
        private alertService: AlertService) { }

    ngOnInit(): void {
        this.apiService.getProducts()
            .subscribe(result => this.products = result)
    }

}
