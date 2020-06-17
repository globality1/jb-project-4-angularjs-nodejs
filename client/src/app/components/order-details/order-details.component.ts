import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FieldValidationService } from 'src/app/services/fieldValidations.service';
import { store } from 'src/app/redux/store';
import { OrderModel } from 'src/app/models/order-model';
import { userShoppingCartService } from 'src/app/services/userShoppingCart.service';
import { OrderService } from 'src/app/services/order.service';
import { ActionType } from 'src/app/redux/actionType';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-order',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderComponent implements OnInit {

  public todayDate: Date;

  public newOrder = new OrderModel();

  public creditCardValue: number;

  public errors = {
    city: "",
    address: "",
    orderDate: "",
    creditCard: "",
    order: ""
  };


  constructor(private myFieldValidationsService: FieldValidationService, private myShoppingCart: userShoppingCartService, private myRouter: Router, private myOrderService: OrderService, private myAuthService: AuthService) { }

  ngOnInit(): void {
    // setting min order date of tomorrow
    this.todayDate = new Date();
    this.todayDate.setDate(this.todayDate.getDate() + 1);
  }

  public validateOrderForm() {
    // doing previous field validation in case someone decides to be smart ass and enable fields and change them
    // city validations
    this.errors.city = "";
    if (!this.myFieldValidationsService.checkIfEmpty(this.newOrder.city).success || !this.myFieldValidationsService.checkIfFieldInZone(this.newOrder.city).success) {
      this.errors.city = "Please Re-select City";
      return false;
    }
    this.errors.city = "";

    // address validations
    if (!this.myFieldValidationsService.checkIfEmpty(this.newOrder.address).success || !this.myFieldValidationsService.checkIfFieldInZone(this.newOrder.address).success) {
      this.errors.address = "Address must be at least 2 characters long and max 40";
      return;
    }
    this.errors.address = "";

    // date validations
    const deliveryDate = new Date(this.newOrder.deliveryDate)
    if (deliveryDate <= new Date()) {
      this.errors.orderDate = "Please select date later than today";
      return;
    }
    this.errors.orderDate = "";

    // check if password same as original or empty
    if (!this.myFieldValidationsService.creditCardValidation(this.creditCardValue).success) {
      this.errors.creditCard = "Invalid Credit Card number";
      return;
    }
    this.errors.creditCard = "";

    // if all valid create new user
    this.submitOrder();
  }

  // register function
  private async submitOrder() {
    try {
      this.newOrder.cartId = store.getState().cart.id;
      this.newOrder.totalPrice = store.getState().cartTotalPrice;
      this.newOrder.userId = store.getState().user.uuid;
      this.newOrder.lastCC = +this.creditCardValue.toString().substring(12, 16);
      store.dispatch({ type: ActionType.SetOrderItems, payload: { orderItems: store.getState().cartItems } })
      const newOrder = await this.myOrderService.createNewOrder(this.newOrder);
      if (newOrder) {
        const shoppingCart = await this.myShoppingCart.checkCartExisting();
        // get and construct shop categories in redux
        if (shoppingCart) {
          const shoppingCartItems = await this.myShoppingCart.getUserShoppingCartItems();
          if (shoppingCartItems) {
            setTimeout(() => { this.myRouter.navigateByUrl("/shop/thank-you") }, 1000)
          }
        }
      }
    }
    catch (err) {
      // logs out client if jwt token has timed out
      if (err.status === 401) {
        const response = await this.myAuthService.logout();
        if (response) {
          setTimeout(() => this.myRouter.navigateByUrl("/home"), 200);
          // store dispatch
          store.getState().socket.disconnect();
          store.dispatch({ type: ActionType.Logout });
          return;
        }
      }
      if(err.taken = 1) {
        this.errors.order = err.error.reason;
        return;
      }
      this.errors.order = "Please contact your admin for more information";
    }

  }


  public fillInAddressDetails() {
    this.newOrder.city = store.getState().user.city;
    this.newOrder.address = store.getState().user.address;
  }
}
