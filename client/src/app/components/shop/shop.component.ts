import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { store } from 'src/app/redux/store';
import { ActionType } from 'src/app/redux/actionType';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  constructor(private myRouter: Router) { }

  ngOnInit(): void {
    // check if user logged in, if no move him to login page
    if (!store.getState().isLoggedIn) {
      this.myRouter.navigateByUrl("/home");
    }
    if (store.getState().isAdmin) {
      this.myRouter.navigateByUrl("/admin");
    }
    // remove orderItems from state so it will reset it self
    store.dispatch({ type: ActionType.SetOrderItems, payload: { orderItems: [] } })
  }


}
