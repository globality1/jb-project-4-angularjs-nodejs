import { Component, OnInit } from '@angular/core';
import { CredentialsModel } from 'src/app/models/credentials-model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { userShoppingCartService } from 'src/app/services/userShoppingCart.service';
import { FieldValidationService } from 'src/app/services/fieldValidations.service';
import { ShopCategoriesService } from 'src/app/services/categories.service';
import { store } from 'src/app/redux/store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  public credentials = new CredentialsModel();
  public errors = {
    email: '',
    password: '',
    login: ''
  };

  constructor(private myAuthService: AuthService, private myRouter: Router, private myFieldValidationsService: FieldValidationService, private myShoppingCart: userShoppingCartService, private myShopCategories: ShopCategoriesService) { }

  ngOnInit(): void {
  }

  public validateForm() {
    // email validations
    if (!this.myFieldValidationsService.checkIfEmpty(this.credentials.email).success) {
      this.errorUpdater("Email Can't Be Empty", '', "Missing Email/Password")
      return;
    }

    // password validations
    if (!this.myFieldValidationsService.checkIfEmpty(this.credentials.password).success) {
      this.errorUpdater("", "Password Can't Be Empty", "Missing Email/Password")
      return;
    }
    
    if (!this.myFieldValidationsService.checkIfEmailFormat(this.credentials.email).success) {
      this.errorUpdater("Email must be in correct Format", '', "Please no try foolish hackings")
      return;
    }


    // login user
    this.authLogin();
  }

  private async authLogin() {
    try {
      // get user response from data source
      const response = await this.myAuthService.loginFlow(this.credentials);
      // if user returned, store all data
      if (response) {
        // check if cat exist
        const shoppingCart = await this.myShoppingCart.checkCartExisting();
        // get and construct shop categories in redux
        const shopCategories = await this.myShopCategories.setShopCategories()
        // if cart exist, move to shop area
        if (shopCategories) {
          const shoppingCartItems = await this.myShoppingCart.getUserShoppingCartItems();
          if(shoppingCartItems != undefined) {
          this.errorUpdater('', '', '')
          if(store.getState().isAdmin) {
            setTimeout(()=>{this.myRouter.navigateByUrl("/admin")}, 1000);
          }
          else if(!store.getState().isAdmin) {
            setTimeout(()=>{this.myRouter.navigateByUrl("/shop")}, 1000);
          }
          }
        }
      }
    }
    catch (err) {
      this.errorUpdater('', '', err.error)
    }
  }
  
  // error changer custom function
  private errorUpdater(emailError?, passwordError?, loginError?) {
    this.errors = {
      email: emailError,
      password: passwordError,
      login: loginError
    }
  }

}
