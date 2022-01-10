import { Component, OnInit } from '@angular/core';
import { ProductDTO } from 'src/app/dtos/product-dto';
import { AlertService } from 'src/app/services/alert/alert.service';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
    selector: 'app-products-page',
    templateUrl: './products.page.component.html',
    styleUrls: ['./products.page.component.css']
})
export class ProductsPageComponent implements OnInit {

    products: ProductDTO[] = [];

    constructor(
        private alertService: AlertService,
        private httpService: HttpService) { }

    ngOnInit(): void {
        
    }

}
