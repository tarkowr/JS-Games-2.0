import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../environments/environment'

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }

    create(username: String){
        return this.http.post(`${environment.apiUrl}/user/create`, { username: username }).toPromise()
    }

    get(id: String){
        return this.http.post(`${environment.apiUrl}/user/get`, { id: id }).toPromise()
    }

    getAll(){
        return this.http.get(`${environment.apiUrl}/user/get/all`).toPromise()
    }
}