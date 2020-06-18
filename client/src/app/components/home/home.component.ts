import { Component, OnInit } from '@angular/core';
import { store } from 'src/app/redux/store';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public productsCount: number;
  public ordersCount: number;


  constructor(private myRouter: Router, private myHomeService: HomeService) { }

  async ngOnInit(): Promise<void> {
    try {
      // if customer if logged in, move him to the shop
      if (store.getState().isLoggedIn) {
        this.myRouter.navigateByUrl("/shop");
      }
      // adding all sort of visual fixes in case data source returns erros or something not wanted
      const productsCount = await this.myHomeService.getProductsCount();
      const ordersCount = await this.myHomeService.getOrdersCount();
      if (ordersCount) {
        this.ordersCount = ordersCount;
      } else if (!ordersCount) {
        this.ordersCount = 0;
      }
      this.productsCount = productsCount;
    }
    catch (err) {
      this.productsCount = 0;
      this.ordersCount = 0;
      
    }
  }

}
