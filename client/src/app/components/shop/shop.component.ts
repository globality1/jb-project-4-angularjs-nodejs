import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { store } from 'src/app/redux/store';
import { AuthService } from 'src/app/services/auth.service';
import { userShoppingCartService } from 'src/app/services/user-shopping-cart';
import { ProductsService } from 'src/app/services/products.service';
import { ShopCategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  public hideCart: boolean;
  public myCart;
  public myProducts;
  public myProductsPreviousSize;


  constructor(private myRouter: Router, private el: ElementRef, private myAuthService: AuthService, private myCartService: userShoppingCartService, private myProductsService: ProductsService, private myShopCategories: ShopCategoriesService) { }

  async ngOnInit()  {
    // check if user logged in, if no move him to login page
    if (!store.getState().isLoggedIn && store.getState().token) {
      const user = await this.myAuthService.reLogin(store.getState().token);
      if(user) {
          this.getAllShopInfo();
          return;
        }
    }
    if (!store.getState().isLoggedIn && !store.getState().token) {
      this.myRouter.navigateByUrl("");
      return;
    }
    if (store.getState().isLoggedIn) {
      this.getAllShopInfo()
      return;
    }
  }

  // adjusting the size of the products view with the e-pane
  public hideCartFromUser(value: boolean) {
    // if containers doesn't exist yet - find them
    if(!this.myCart) {
      this.myCart = this.el.nativeElement.querySelectorAll(".e-pane")[0];
      this.myProducts = this.el.nativeElement.querySelectorAll(".e-pane")[1];
    }
    // set hidecart as value
    this.hideCart = value;
    // set hidden as value
    this.myCart.hidden = this.hideCart;
    if(value === true) {
      // save previous size
      this.myProductsPreviousSize = this.myProducts.style.flexBasis;
      // set size to 100%
      this.myProducts.style.flexBasis = "100%"
      return;
    };
    // return previous size
    this.myProducts.style.flexBasis = this.myProductsPreviousSize;
  }

  private async getAllShopInfo() {
    await this.myShopCategories.setShopCategories();
    await this.myProductsService.setShopProducts();
    await this.myCartService.checkCartExisting();
    await this.myCartService.getUserShoppingCartItems();
    return true
  }

}
