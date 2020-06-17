import { Component, OnInit } from '@angular/core';
import { store } from 'src/app/redux/store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {

  constructor(private myRouter: Router) { }

  ngOnInit(): void {
    if(!store.getState().isLoggedIn || store.getState().cartItems.length === 0) {
      this.myRouter.navigateByUrl("/home");
      }
  }

}
