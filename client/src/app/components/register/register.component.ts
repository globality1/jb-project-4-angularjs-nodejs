import { Component, OnInit } from '@angular/core';
import { NewUserModel } from 'src/app/models/new-user-model';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/services/register.service';
import { AuthService } from 'src/app/services/auth.service';
import { FieldValidationService } from 'src/app/services/field-validations';
import { store } from 'src/app/redux/store';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public buttonsDisabled = {
    first: false,
    second: true
  }

  public registerError: string;

  public newUser: NewUserModel;

  public cities = ["Tel Aviv", "Haifa", "Raanana", "Bat Yam", "Holon", "Hertzelia", "Ashkelon", "Ashdod", "Beer Sheva"];

  constructor(private myRegisterService: RegisterService, private myRouter: Router, private myAuthService: AuthService, private myFieldValidationsService: FieldValidationService) { }

  ngOnInit()  {

    if (store.getState().isLoggedIn) {
      this.myRouter.navigateByUrl("/shop");
    }
    this.newUser = new NewUserModel();

  }

  // inner validation
  public validateRegisterFormFirst(registrationForm: NgForm): boolean {

    // first name validations
    if (!this.myFieldValidationsService.checkIfEmpty(this.newUser.firstName).success || !this.myFieldValidationsService.checkIfFieldInZone(this.newUser.firstName).success) {
      registrationForm.controls['firstName'].setErrors({ 'invalid': true });
      return false;
    }
    registrationForm.controls['firstName'].setErrors({ 'invalid': false });
    registrationForm.controls['firstName'].disable();

    // last name validations
    if (!this.myFieldValidationsService.checkIfEmpty(this.newUser.lastName).success || !this.myFieldValidationsService.checkIfFieldInZone(this.newUser.lastName).success) {
      registrationForm.controls['lastName'].setErrors({ 'invalid': true });
      return false;
    }
    registrationForm.controls['lastName'].setErrors({ 'invalid': false });
    registrationForm.controls['lastName'].disable();

    // email validations
    if (!this.myFieldValidationsService.checkIfEmpty(this.newUser.email).success || !this.myFieldValidationsService.checkIfEmailFormat(this.newUser.email).success) {
      registrationForm.controls['email'].setErrors({ 'invalid': true });
      return false;
    }
    registrationForm.controls['email'].setErrors({ 'invalid': false });
    registrationForm.controls['email'].disable();

    // personalId validations
    if (!this.myFieldValidationsService.checkIfEmpty(this.newUser.personalId).success || !this.myFieldValidationsService.checkIfPersonalIdNotFake(+this.newUser.personalId).success) {
      registrationForm.controls['personalId'].setErrors({ 'invalid': true });
      return false;
    }
    registrationForm.controls['personalId'].setErrors({ 'invalid': false });
    registrationForm.controls['personalId'].disable();
    this.buttonsDisabled.first = true;
    this.buttonsDisabled.second = false;
    registrationForm.controls['city'].enable();
    registrationForm.controls['address'].enable();
    registrationForm.controls['password'].enable();
    registrationForm.controls['confirmPassword'].enable();

    return true;
  }

  public validateRegisterForm(registrationForm: NgForm) {
    // doing previous field validation in case someone decides to be smart ass and enable fields and change them
    this.registerError = '';
    if (this.validateRegisterFormFirst(registrationForm)) {
      // city validations
      if (!this.myFieldValidationsService.checkIfEmpty(this.newUser.city).success || !this.myFieldValidationsService.checkIfFieldInZone(this.newUser.city).success) {
        registrationForm.controls['city'].setErrors({ 'invalid': true });
        return false;
      }
      registrationForm.controls['city'].setErrors({ 'invalid': false });
      registrationForm.controls['city'].disable();

      // address validations
      if (!this.myFieldValidationsService.checkIfEmpty(this.newUser.address).success || !this.newUser.address || this.newUser.address.length < 5 || this.newUser.address.length > 40) {
        registrationForm.controls['address'].setErrors({ 'invalid': true });
        return;
      }
      registrationForm.controls['address'].setErrors({ 'invalid': false });
      registrationForm.controls['address'].disable();

      // password validations
      if (!this.myFieldValidationsService.checkIfEmpty(this.newUser.password).success || !this.myFieldValidationsService.checkIfPasswordValid(this.newUser.password).success) {
        registrationForm.controls['password'].setErrors({ 'invalid': true });
        return;
      }
      registrationForm.controls['password'].setErrors({ 'invalid': false });
      registrationForm.controls['password'].disable();

      // check if password same as original or empty
      if (this.newUser.password !== this.newUser.confirmPassword) {
        registrationForm.controls['confirmPassword'].setErrors({ 'invalid': true });
        return;
      }
      registrationForm.controls['confirmPassword'].setErrors({ 'invalid': false });
      registrationForm.controls['confirmPassword'].disable();

      // if all valid create new user
      this.registerNewUser(registrationForm);
    }
  }

  // register function
  private async registerNewUser(registrationForm: NgForm) {
    try {
      const auth = await this.myRegisterService.registerNewUser(this.newUser);
      if (auth) {
        const credentials = {
          email: this.newUser.email,
          password: this.newUser.password
        }
        // send new user info to login 
        setTimeout(() => this.loginNewUser(credentials), 100);
      }
      // custom redirect to shop
    }
    catch (err) {
      if(err.error.personalId) {
        registrationForm.controls["personalId"].enable();
        registrationForm.controls["personalId"].setErrors({ 'exist': true})
        return;
      }
      registrationForm.controls["personalId"].setErrors({ 'exist': false})
      if(err.error.email) {
        registrationForm.controls["email"].enable();
        registrationForm.controls["email"].setErrors({ 'exist': true})
        return;
      }
      registrationForm.controls["email"].setErrors({ 'exist': false})
    }
  }


  // login new registered user
  private async loginNewUser(credentials) {
    try {
      // get user response from data source
      const response = await this.myAuthService.loginFlow(credentials);
      // if user returned, store all data
      if (response) {
        // this.myAuthService.storeUserInfo(user);
          setTimeout(() => { this.myRouter.navigateByUrl("/shop") }, 1000);
          this.newUser = new NewUserModel();
          return;
        }
      this.myRouter.navigateByUrl("/home");
    }
    catch (err) {
      this.registerError = "Contact Admin for more information"
    }
  }


}
