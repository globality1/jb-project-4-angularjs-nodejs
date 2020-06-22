import { Component, Input, OnInit} from '@angular/core';
import { apiBaseURL } from 'src/environments/environment';


@Component({
  selector: 'app-product-card-admin',
  templateUrl: './product-card-admin.component.html',
  styleUrls: ['./product-card-admin.component.css']
})
export class ProductCardComponentAdmin implements OnInit {
  public apiBaseURL;
  
  public constructor() {};

  ngOnInit() {
    this.apiBaseURL = apiBaseURL;
  }

  @Input()
  public productId: number;

  @Input() 
  public imageSource: string;

  @Input() 
  public productName: string;

  @Input() 
  public productPrice: number;
   
}
