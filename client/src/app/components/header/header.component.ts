import { Component, OnInit } from '@angular/core';
import { store } from 'src/app/redux/store';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ActionType } from 'src/app/redux/actionType';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public name: string;
  public isLoggedIn: boolean;

  constructor(private myRouter: Router, private myAuthService: AuthService) { }

  ngOnInit(): void {
    // set first default values
    this.name = "Guest";
    // subscribe to store
    store.subscribe(() => {
      if (store.getState().user) {
        this.name = store.getState().user.firstName;
        this.isLoggedIn = store.getState().isLoggedIn;
      }
    })
    if (store.getState().isLoggedIn) {
      this.name = store.getState().user.firstName;
      this.isLoggedIn = store.getState().isLoggedIn;
    }
  }

  // logout function
  public async logout() {
    try {
      const response = await this.myAuthService.logout();
      if (response) {
        this.name = "Guest";
        this.isLoggedIn = false;
        setTimeout(() => this.myRouter.navigateByUrl("/home"), 200);
        // store dispatch
        store.getState().socket.disconnect();
        store.dispatch({ type: ActionType.Logout });
      }
    }
    catch (err) {
      console.log(err.response ? err.response.data : err.message);
    }
  }



}
