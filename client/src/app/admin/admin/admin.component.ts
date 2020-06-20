import { Component, OnInit } from '@angular/core';
import { ProductModel } from 'src/app/models/product-model';
import { store } from 'src/app/redux/store';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public product: ProductModel;

  constructor(private myRouter: Router, private myAuthService: AuthService ) { }

  async ngOnInit(): Promise<void> {
    if(!store.getState().isLoggedIn && localStorage.getItem("token")) {
      const user = await this.myAuthService.reLogin(store.getState().token);
      if(!user.isAdmin) {
       this.myRouter.navigateByUrl("/shop");
       return;
      }
    }
    if(!store.getState().isLoggedIn && localStorage.getItem("token")) {
      this.myRouter.navigateByUrl("/home")
    }
  }
  
}
