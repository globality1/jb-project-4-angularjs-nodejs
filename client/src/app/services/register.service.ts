// http based services
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NewUserModel } from '../models/new-user-model';
import { apiBaseURL } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RegisterService {

    constructor(private http: HttpClient) { }

    // register new user
    public registerNewUser(user): Promise<NewUserModel[]> {
        return this.http.post<NewUserModel[]>(apiBaseURL + "/users", user).toPromise();
    }

}
