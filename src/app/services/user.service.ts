import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }

    // Fetch user data by ID
    get(id: string) : Promise<any> {
        return this.http.get(`${environment.apiUrl}/api/user/${id}`).toPromise();
    }

    // Add a new user to the website
    add(username: string) : Promise<any> {
        return this.http.post(`${environment.apiUrl}/api/user`, { username: username }).toPromise();
    }
}