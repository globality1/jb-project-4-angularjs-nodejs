import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { store } from 'src/app/redux/store';
import { ActionType } from 'src/app/redux/actionType';
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
  public myDiv;
  public cartSize;
  public productsSize;

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
      this.myRouter.navigateByUrl("/home");
      return;
    }
    if (store.getState().isLoggedIn) {
      this.getAllShopInfo()
      return;
    }

  }

  public hideCartFromUser(value: boolean) {
    if(!this.myDiv) {
      this.myDiv = this.el.nativeElement.querySelectorAll("div")[1]
     }
    this.hideCart = value;
    this.myDiv.hidden = this.hideCart;
  }

  private async getAllShopInfo() {
    await this.myShopCategories.setShopCategories();
    await this.myProductsService.setShopProducts();
    await this.myCartService.checkCartExisting();
    await this.myCartService.getUserShoppingCartItems();
    return true
  }

}
