import { Component, OnInit } from '@angular/core';
import { CredentialsModel } from 'src/app/models/credentials-model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FieldValidationService } from 'src/app/services/field-validations';
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

  ngOnInit() {
  }

  public validateForm(loginForm: NgForm) {
    this.loginError = '';
    // email validations
    if (!this.myFieldValidationsService.checkIfEmpty(this.credentials.email).success || !this.myFieldValidationsService.checkIfEmailFormat(this.credentials.email).success) {
      loginForm.controls['email'].setErrors({ 'incorrect': true });
      return;
    }
    loginForm.controls['email'].setErrors({ 'incorrect': false });
    loginForm.controls['email'].disable();

    // password validations
    if (!this.myFieldValidationsService.checkIfEmpty(this.credentials.password).success) {
      loginForm.controls['password'].setErrors({ 'incorrect': true });
      return;
    }
    loginForm.controls['password'].setErrors({ 'incorrect': false });
    loginForm.controls['password'].disable();

    // login user
    this.authLogin(loginForm);
  }

  private async authLogin(loginForm: NgForm) {
    try {
      // get user response from data source
      const response = await this.myAuthService.loginFlow(this.credentials);
      // if user returned, store all data
      if (response) {
        if (store.getState().isAdmin) {
          this.myRouter.navigateByUrl("/admin");
          return;
        }
        else if (!store.getState().isAdmin) {
          this.myRouter.navigateByUrl("/shop");
          return;
        }
      }
    }
    catch (err) {
      // enable form if error is due to incorrect password/email
      loginForm.controls['email'].enable();
      loginForm.controls['password'].enable();
      if (err.status === 403) {
        this.loginError = err.error;
        return;
      }
      this.loginError = 'Please contact the Admin';
    }
  }


}
