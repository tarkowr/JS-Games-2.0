import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject } from 'rxjs';
import { environment } from '../../environments/environment';

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

    // Fetch user data by ID
    get(id: string) : Promise<any> {
        return this.http.get(`${environment.apiUrl}/api/user/${id}`).toPromise();
    }

    // Save new user
    add(username: string) : Promise<any> {
        return this.http.post(`${environment.apiUrl}/api/user`, { username: username }).toPromise();
    }
}