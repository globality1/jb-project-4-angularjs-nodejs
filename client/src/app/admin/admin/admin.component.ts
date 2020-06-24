import { Component, OnInit } from '@angular/core';
import { ProductModel } from 'src/app/models/product-model';
import { store } from 'src/app/redux/store';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { userShoppingCartService } from 'src/app/services/user-shopping-cart';
import { ProductsService } from 'src/app/services/products.service';
import { ShopCategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public product: ProductModel;
  public clicked: boolean;

  constructor(private myRouter: Router, private myAuthService: AuthService, private myCartService: userShoppingCartService, private myProductsService: ProductsService, private myShopCategories: ShopCategoriesService ) { }

  async ngOnInit(): Promise<void> {
    if(!store.getState().isLoggedIn && store.getState().token) {
      const user = await this.myAuthService.reLogin(store.getState().token);
      if(user.isAdmin === 0) {
       this.myRouter.navigateByUrl("/shop");
       return;
      }
      this.getAllShopInfo();
    }

    if (store.getState().isLoggedIn) {
      this.getAllShopInfo()
      return;
    }

    if (store.getState().isLoggedIn && store.getState().user.isAdmin === 0) {
      this.myRouter.navigateByUrl("/shop")
      return;
    }

  }

  public addNewProductButton() {
     if(this.myRouter.url === "/admin/add") {
      this.myRouter.navigateByUrl("/admin");
      return;
     }
     this.myRouter.navigateByUrl("admin/add")
  }

  private async getAllShopInfo() {
    await this.myShopCategories.setShopCategories();
    await this.myProductsService.setShopProducts();
    await this.myCartService.checkCartExisting();
    await this.myCartService.getUserShoppingCartItems();
    return true
  }

  
}
