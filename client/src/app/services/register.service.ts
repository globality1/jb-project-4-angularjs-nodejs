// http based services
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NewUserModel } from '../models/new-user-model';

@Injectable({
    providedIn: 'root'
})
export class RegisterService {

    constructor(private http: HttpClient) { }

    public registerNewUser(user): Promise<NewUserModel[]> {
        return this.http.post<NewUserModel[]>("http://localhost:3000/api/users", user).toPromise();
    }

}
