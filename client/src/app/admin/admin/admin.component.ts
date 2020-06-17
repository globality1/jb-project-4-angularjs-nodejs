import { Component, OnInit } from '@angular/core';
import { ProductModel } from 'src/app/models/product-model';
import { store } from 'src/app/redux/store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public product: ProductModel;

  constructor(private myRouter: Router) { }

  async ngOnInit(): Promise<void> {
    if(!store.getState().isAdmin) {
      this.myRouter.navigateByUrl("/home");
    }
  }

}
