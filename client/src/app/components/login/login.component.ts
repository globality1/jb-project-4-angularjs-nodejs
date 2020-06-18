import { Component, OnInit } from '@angular/core';
import { CredentialsModel } from 'src/app/models/credentials-model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { userShoppingCartService } from 'src/app/services/user-shopping-cart';
import { FieldValidationService } from 'src/app/services/field-validations';
import { ShopCategoriesService } from 'src/app/services/categories.service';
import { store } from 'src/app/redux/store';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  public credentials = new CredentialsModel();
  public loginError: string;


  constructor(private myAuthService: AuthService, private myRouter: Router, private myFieldValidationsService: FieldValidationService) { }

  ngOnInit(): void {
  }

  public validateForm(loginForm: NgForm) {
    // email validations
    if (!this.myFieldValidationsService.checkIfEmpty(this.credentials.email).success || !this.myFieldValidationsService.checkIfEmailFormat(this.credentials.email).success) {
      loginForm.controls['email'].setErrors({ 'incorrect': true });
      return;
    }
    loginForm.controls['email'].setErrors({ 'incorrect': false });

    // password validations
    if (!this.myFieldValidationsService.checkIfEmpty(this.credentials.password).success) {
      loginForm.controls['password'].setErrors({ 'incorrect': true });
      return;
    }
    loginForm.controls['password'].setErrors({ 'incorrect': false });

    // login user
    this.authLogin();
  }

  private async authLogin() {
    try {
      // get user response from data source
      const response = await this.myAuthService.loginFlow(this.credentials);
      // if user returned, store all data
      if (response) {
        if (store.getState().isAdmin) {
          setTimeout(() => { this.myRouter.navigateByUrl("/admin") }, 1000);
        }
        else if (!store.getState().isAdmin) {
          setTimeout(() => { this.myRouter.navigateByUrl("/shop") }, 1000);
        }
      }
    }
    catch (err) {
      if (err.status === 403) {
        this.loginError = err.error;
        return;
      }
      this.loginError = "Please Contact admin";
    }
  }


}
