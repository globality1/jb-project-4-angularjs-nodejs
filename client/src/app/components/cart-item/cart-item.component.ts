import { Component, Input, OnInit } from '@angular/core';
import { apiBaseURL } from 'src/environments/environment';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit{

  public apiBaseURL;

  constructor() {}

  ngOnInit() {
    this.apiBaseURL = apiBaseURL;
  }
  
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
