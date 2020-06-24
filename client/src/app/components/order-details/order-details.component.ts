import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FieldValidationService } from 'src/app/services/field-validations';
import { store } from 'src/app/redux/store';
import { OrderModel } from 'src/app/models/order-model';
import { userShoppingCartService } from 'src/app/services/user-shopping-cart';
import { OrderService } from 'src/app/services/order.service';
import { ActionType } from 'src/app/redux/actionType';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-order',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderComponent implements OnInit {

  public todayDate: Date;

  public newOrder = new OrderModel();

  public creditCardValue: number;

  public cities = ["Tel Aviv", "Haifa", "Raanana", "Bat Yam", "Holon", "Hertzelia", "Ashkelon", "Ashdod", "Beer Sheva"];


  constructor(private myFieldValidationsService: FieldValidationService, private myShoppingCart: userShoppingCartService, private myRouter: Router, private myOrderService: OrderService, private myAuthService: AuthService) { }

  ngOnInit()  {
    // setting min order date of tomorrow
    this.todayDate = new Date();
    this.todayDate.setDate(this.todayDate.getDate() + 1);
  }

    // fill in shipping details from user infromation
  public fillInAddressDetails(orderForm: NgForm) {
    // set city and address from store
    this.newOrder.city = store.getState().user.city;
    this.newOrder.address = store.getState().user.address;
    // enable form fields in case it was disabled from some previous action
    orderForm.controls['address'].enable();
    orderForm.controls['city'].enable()
  }

  public validateOrderForm(orderForm: NgForm) {
    // doing previous field validation in case someone decides to be smart ass and enable fields and change them
    // city validations
    if (!this.myFieldValidationsService.checkIfEmpty(this.newOrder.city).success || !this.myFieldValidationsService.checkIfFieldInZone(this.newOrder.city).success) {
      orderForm.controls['city'].setErrors({ 'invalid': true });
      return false;
    }
    orderForm.controls['city'].setErrors({ 'invalid': false });
    orderForm.controls['city'].disable();

    // address validations
    if (!this.myFieldValidationsService.checkIfEmpty(this.newOrder.address).success || !this.newOrder.address || this.newOrder.address.length < 5 || this.newOrder.address.length > 40) {
      orderForm.controls['address'].setErrors({ 'invalid': true });
      return;
    }
    orderForm.controls['address'].setErrors({ 'invalid': false });
    orderForm.controls['address'].disable();

    // date validations
    const dateOfOrder = new Date(this.newOrder.deliveryDate)
    if (dateOfOrder <= new Date()) {
      orderForm.controls['dateOfOrder'].setErrors({ 'invalid': true });
      return;
    }
    orderForm.controls['dateOfOrder'].setErrors({ 'invalid': false });
    orderForm.controls['dateOfOrder'].disable();

    // check if password same as original or empty
    if (!this.myFieldValidationsService.checkIfEmpty(this.creditCardValue).success || !this.myFieldValidationsService.creditCardValidation(this.creditCardValue).success) {
      orderForm.controls['creditCard'].setErrors({ 'invalid': true });
      return;
    }
    orderForm.controls['creditCard'].setErrors({ 'invalid': false });
    orderForm.controls['creditCard'].disable();

    // if all valid create new user
    this.submitOrder(orderForm);
  }

  // register function with 
  private async submitOrder(orderForm: NgForm) {
    try {
      this.newOrder.cartId = store.getState().cart.id;
      this.newOrder.totalPrice = store.getState().cartTotalPrice;
      this.newOrder.userId = store.getState().user.uuid;
      this.newOrder.lastCC = +this.creditCardValue.toString().substring(12, 16);
      store.dispatch({ type: ActionType.SetOrderItems, payload: { orderItems: store.getState().cartItems } })
      const newOrder = await this.myOrderService.createNewOrder(this.newOrder);
      if (newOrder) {
        // if order is made, create new cart in data source
        const shoppingCart = await this.myShoppingCart.checkCartExisting();
        // after new cart returned, clean all the cart items
        if (shoppingCart) {
          await this.myShoppingCart.getUserShoppingCartItems();
          setTimeout(() => { this.myRouter.navigateByUrl("/shop/thank-you") }, 1000)
        }
      }
    }
    catch (err) {
      // logs out client if jwt token has timed out
      if (err.status === 401) {
        const response = await this.myAuthService.logout();
        if (response) {
          this.myRouter.navigateByUrl("");
          // store dispatch
          return;
        }
      }
      // if error is due to date already having 3 orders
      if (err.taken = 1) {
        orderForm.controls['dateOfOrder'].enable();
        orderForm.controls['dateOfOrder'].setErrors({ 'taken': true })
        return;
      }
      // if something else
      orderForm.errors.setErrors({'finalError': "Please contact your admin for more information"});
    }

  }

}
