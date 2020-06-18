import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  // get all products count
  public async getProductsCount(): Promise<number> {
    return this.http.get<number>("http://localhost:3000/api/shopGeneralInformation/products").toPromise();
  }

  // get all orders count
  public async getOrdersCount(): Promise<number> {
    return this.http.get<number>("http://localhost:3000/api/shopGeneralInformation/orders").toPromise();
  }

}
