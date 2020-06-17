import { Component, OnInit } from '@angular/core';
import { NewUserModel } from 'src/app/models/new-user-model';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/services/register.service';
import { AuthService } from 'src/app/services/auth.service';
import { FieldValidationService } from 'src/app/services/fieldValidations.service';
import { userShoppingCartService } from 'src/app/services/userShoppingCart.service';
import { store } from 'src/app/redux/store';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public buttonDisabled = {
    firstName: false,
    lastName: false,
    personalId: false,
    email: false,
    continue: false,
    address: true,
    password: true,
    confirmPassword: true,
    city: true,
    register: true
  }

  public newUser = new NewUserModel();

  public errors = {
    firstName: "",
    lastName: "",
    personalId: "",
    city: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
    register: ""
  };


  constructor(private myRegisterService: RegisterService, private myRouter: Router, private myAuthService: AuthService, private myFieldValidationsService: FieldValidationService, private myShoppingCart: userShoppingCartService) { }

  ngOnInit(): void {
    if(store.getState().isLoggedIn) {
      this.myRouter.navigateByUrl("/shop");
      }
  }
  
  public validateRegisterFormFirst(): boolean {

    // first name validations
    if (!this.myFieldValidationsService.checkIfEmpty(this.newUser.firstName).success || !this.myFieldValidationsService.checkIfFieldInZone(this.newUser.firstName).success) {
      this.errors.firstName = "First Name Can't be Empty and 2-15 Characters long only English Characters";
      return false;
    }
    this.errors.firstName = "";

    // last name validations
    if (!this.myFieldValidationsService.checkIfEmpty(this.newUser.lastName).success || !this.myFieldValidationsService.checkIfFieldInZone(this.newUser.lastName).success) {
      this.errors.lastName = "Last Name Can't be Empty and 2-15 Characters long only English Characters";
      return false;
    }
    this.errors.lastName = "";

    // email validations
    if (!this.myFieldValidationsService.checkIfEmpty(this.newUser.email).success || !this.myFieldValidationsService.checkIfEmailFormat(this.newUser.email).success) {
      this.errors.email = "Email must be in valid email format";
      return false;
    }
    this.errors.email = "";

    // personalId validations
    if (!this.myFieldValidationsService.checkIfEmpty(this.newUser.personalId).success || !this.myFieldValidationsService.checkIfPersonalIdNotFake(this.newUser.personalId).success) {
      this.errors.personalId = "Personal ID Must be 9 digits long";
      return false;
    }
    this.errors.personalId = "";

    this.buttonDisabled = {
      firstName: true,
      lastName: true,
      personalId: true,
      email: true,
      continue: true,
      address: false,
      password: false,
      confirmPassword: false,
      city: false,
      register: false
    }
    return true;
  }


  public validateRegisterForm() {
    // doing previous field validation in case someone decides to be smart ass and enable fields and change them
    if (this.validateRegisterFormFirst()) {

      // city validations
      if (!this.myFieldValidationsService.checkIfEmpty(this.newUser.city).success || !this.myFieldValidationsService.checkIfFieldInZone(this.newUser.city).success) {
        this.errors.city = "First Name Can't be Empty and 2-15 Characters long only English Characters";
        return false;
      }
      this.errors.city = "";

      // address validations
      if (!this.myFieldValidationsService.checkIfEmpty(this.newUser.address).success || !this.newUser.address || this.newUser.address.length < 5 || this.newUser.address.length > 40) {
        this.errors.address = "Address Must be 5-40 characters long";
        return;
      }
      this.errors.address = "";

      // password validations
      if (!this.myFieldValidationsService.checkIfEmpty(this.newUser.password).success || !this.myFieldValidationsService.checkIfPasswordValid(this.newUser.password).success) {
        this.errors.password = "Password Must be 8-20 Characters 1 upper case, 1 lower case and 1 special Character";
        return;
      }
      this.errors.password = "";

      // check if password same as original or empty
      if (this.newUser.password !== this.newUser.confirmPassword) {
        this.errors.confirmPassword = "Passwords Don't Match";
        return;
      }
      this.errors.confirmPassword = "";

      // if all valid create new user
      this.registerNewUser();
    }
  }

  // register function
  private async registerNewUser() {
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
      this.errors.register = err.error;
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
        const shoppingCart = await this.myShoppingCart.checkCartExisting();
        // if cart exist, move to shop area
        if (shoppingCart) {
          const shoppingCartItems = await this.myShoppingCart.getUserShoppingCartItems();
          if(shoppingCartItems) {
          setTimeout(()=>{this.myRouter.navigateByUrl("/shop")}, 1000);
          }
        }
      } else {
        setTimeout(()=>{this.myRouter.navigateByUrl("/shop")}, 1000);
      }
    }
    catch (err) {
      this.errors.register = err.error;
    }
  }


}
