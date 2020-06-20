import { Component, OnInit } from '@angular/core';
import { store } from 'src/app/redux/store';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserModel } from 'src/app/models/user-model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public user: UserModel = new UserModel;

  constructor(private myRouter: Router, private myAuthService: AuthService) { }

  ngOnInit(): void {
    // set first default values
    this.user.firstName = "Guest";
    // subscribe to store
    store.subscribe(() => {
      if (store.getState().user) {
        this.user = store.getState().user
      }
    })
    if (store.getState().isLoggedIn) {
      this.user = store.getState().user
    }
  }

  // logout function
  public async logout() {
    this.myAuthService.logout();
    this.myRouter.navigateByUrl("/home");
  }

}
