import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiBaseURL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  // get all products count
  public getProductsCount(): Promise<number> {
    return this.http.get<number>(apiBaseURL + "/shopGeneralInformation/products").toPromise();
  }

  // get all orders count
  public getOrdersCount(): Promise<number> {
    return this.http.get<number>(apiBaseURL + "/shopGeneralInformation/orders").toPromise();
  }

}
