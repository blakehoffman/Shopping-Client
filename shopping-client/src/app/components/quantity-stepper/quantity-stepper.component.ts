import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'quantity-stepper',
  templateUrl: './quantity-stepper.component.html',
  styleUrls: ['./quantity-stepper.component.css']
})
export class QuantityStepperComponent implements OnInit {

  quantity: number = 1;
  @Output() quantityEvent = new EventEmitter<number>()

  constructor() { }

  ngOnInit(): void {
    this.quantityEvent.emit(this.quantity);
  }

  decrementQuantity(): void {
    if (this.quantity == 1) {
      return;
    }

    this.quantity -= 1;
    this.quantityEvent.emit(this.quantity);
  }

  incrementQuantity(): void {
    if (this.quantity == 10) {
      return;
    }
    
    this.quantity += 1;
    this.quantityEvent.emit(this.quantity);
  }

}
