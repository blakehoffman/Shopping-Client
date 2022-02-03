import { Component, Input, OnInit } from '@angular/core';
import { ProductDTO } from 'src/app/dtos/product-dto';

@Component({
    selector: 'product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

    @Input() product: ProductDTO | undefined;

    constructor() { }

    ngOnInit(): void {
    }

}
