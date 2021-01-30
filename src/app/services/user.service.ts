import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private _user: ReplaySubject<any>;

    constructor(private http: HttpClient) { 
        this._user = new ReplaySubject<any>(1);
    }

    get user() : any {
        return this._user.asObservable();
    }

    set user(user: any) {
        this._user.next(user);
    }

    // Determine whether user object is empty
    isNotEmpty(user: User) : boolean {
        return Object.keys(user).length !== 0;
    }

    // Fetch user data by ID
    get(id: string) : Promise<any> {
        return this.http.get(`${environment.apiUrl}/api/user/${id}`).toPromise();
    }

    // Save new user
    add(username: string, color: string) : Promise<any> {
        return this.http.post(`${environment.apiUrl}/api/user`, { username: username, color: color }).toPromise();
    }
}