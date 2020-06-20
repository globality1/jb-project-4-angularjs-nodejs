import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user-model';
import { store } from '../redux/store';
import { ActionType } from '../redux/actionType';

import { apiBaseURL } from 'src/environments/environment';
import { authHeaders } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) { }

    private authLogin(credentials): Promise<UserModel[]> {
        return this.http.post<UserModel[]>(apiBaseURL + "/auth/login", credentials).toPromise();
    }

    // pass login data to the data source and pass it to store it in the app
    public async loginFlow(credential): Promise<boolean> {
        const user = await this.authLogin(credential);
        if (user) {
            store.dispatch({ type: ActionType.Login, payload: { user } });
            return true;
        }
        else {
            return false;
        }
    }

    private getUserByToken(token: string): Promise<UserModel> {
        return this.http.post<UserModel>(apiBaseURL + "/auth/relogin", token, { headers: authHeaders.createHeader(store.getState().token) }).toPromise()
    }

    public async reLogin(token: string) {
        try {
            const user = await this.getUserByToken(token);
            if (!user) {
                this.logout();
            }
            store.dispatch({ type: ActionType.Login, payload: { user } });
            return user;
        }
        catch (err) {
            this.logout();
        }
    }

    // had some trouble converting this one to http for some reason so went with axios
    public async logout() {
        store.getState().socket.disconnect();
        store.dispatch({ type: ActionType.Logout });
        return true;
    }

}
