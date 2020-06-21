import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent{

  constructor() {}
  
  @Input()
  public itemId: number;

  @Input()
  public productName: string;

  @Input()
  public productImageName: string;

  @Input() 
  public productQuantity: string;

  @Input() 
  public totalPrice: number;

  @Input()
  public searchValue?: string;

}
