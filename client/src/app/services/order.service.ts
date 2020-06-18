import { Injectable } from '@angular/core';
import { OrderModel } from '../models/order-model';
import { store } from '../redux/store';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  // create new order in data source
  public async createNewOrder(order: OrderModel): Promise<any> {
    const headers = {
        authorization: "Bearer " + store.getState().token
    }
    return this.http.post<OrderModel>("http://localhost:3000/api/orders/new", order, { headers: headers } ).toPromise();
}

}
