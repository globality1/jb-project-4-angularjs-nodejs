import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user-model';
import { store } from '../redux/store';
import { ActionType } from '../redux/actionType';
import { ProductModel } from '../models/product-model';
import axios from "axios";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    myRouter: any;

    constructor(private http: HttpClient) { }

    private authLogin(credentials): Promise<UserModel[]> {
        return this.http.post<UserModel[]>("http://localhost:3000/api/auth/login", credentials).toPromise();
    }

    public async loginFlow(credential) : Promise<boolean> {
        const user = await this.authLogin(credential);
        if(user) {
           return this.storeUserInfo(user);
        }
        else {
            return false;
        }    
    }

    private storeUserInfo(user:UserModel[]): boolean {
        if (user) {
            // store user
            store.dispatch({ type: ActionType.Login, payload: { user } });
            // send socket to server client have connected
        store.getState().socket.connect()
        store.getState().socket.emit("update-from-app", 'Success');
        // get response back from server with all products info as first without making additional call to the server,
        // and make products be based on socket if any update / new product event occurs - same for everyone
        store.getState().socket.on("update-from-server", (products: ProductModel[]) => {
            // if products returned, 
            if (products) {
                store.dispatch({ type: ActionType.GetProducts, payload: { products } })
            }
        });
        return true;
        }
        else {
            return false
        }
    }
    // had some trouble converting this one to http for some reason
    public async logout() {
        try {
          const response = await axios.post("http://localhost:3000/api/auth/logout");
          // check if response
          if (response) {
            // disconnect socket
            // custom changes to header values
            // small time out for redirecting the user
            return true;
          }
        }
        catch (err) {
          console.log(err.response ? err.response.data : err.message);
        }
      }

}
