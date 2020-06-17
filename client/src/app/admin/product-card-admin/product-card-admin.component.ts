import { Component, Input} from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product-card-admin',
  templateUrl: './product-card-admin.component.html',
  styleUrls: ['./product-card-admin.component.css']
})
export class ProductCardComponentAdmin {
  
  public constructor(private myRouter: Router) {};
  @Input()
  public productId: number;

  @Input() 
  public imageSource: string;

  @Input() 
  public productName: string;

  @Input() 
  public productPrice: number;

  public editProduct(){
    this.myRouter.navigateByUrl("/admin/edit/" + this.productId);
  }
   
}
