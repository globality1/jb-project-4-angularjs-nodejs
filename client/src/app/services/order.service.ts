import { Injectable } from '@angular/core';
import { OrderModel } from '../models/order-model';
import { store } from '../redux/store';
import { HttpClient } from '@angular/common/http';
import { apiBaseURL } from 'src/environments/environment';
import { authHeaders } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  // create new order in data source
  public createNewOrder(order: OrderModel): Promise<any> {
    return this.http.post<OrderModel>(apiBaseURL + "/orders/new", order, { headers: authHeaders.createHeader(store.getState().token) }).toPromise();
  }

}
