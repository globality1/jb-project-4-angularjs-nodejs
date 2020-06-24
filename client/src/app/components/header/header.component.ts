import { Component, OnInit } from '@angular/core';
import { store } from 'src/app/redux/store';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserModel } from 'src/app/models/user-model';
import { apiBaseURL } from 'src/environments/environment';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public user: UserModel = new UserModel;
  public isLoggedIn: boolean;
  public apiBaseURL;

  constructor(private myRouter: Router, private myAuthService: AuthService) { }

  async ngOnInit() {
    // set first default values
    this.user.firstName = "Guest";
    // subscribe to store
    store.subscribe(() => {
      if (store.getState().user) {
        this.user = store.getState().user
      }
      this.isLoggedIn = store.getState().isLoggedIn
    })
    if (store.getState().isLoggedIn) {
      this.user = store.getState().user
    }
    if(store.getState().token) {
      this.user = await this.myAuthService.reLogin(store.getState().token);
      if(this.user.token) {
        this.isLoggedIn = true;
      }
    }
    this.apiBaseURL = apiBaseURL;

  }

  // logout function
  public async logout() {
    this.myAuthService.logout();
    this.myRouter.navigateByUrl("");
  }

}
