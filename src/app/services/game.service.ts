import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../environments/environment'

@Injectable({
    providedIn: 'root'
})
export class GameService {
    constructor(private http: HttpClient) { }

    matchingResults(id: String, score: Number){
        return this.http.post(`${environment.apiUrl}/game/matching/results`, { id: id, score: score }).toPromise()
    }

    getMatching(){
        return this.http.get(`${environment.apiUrl}/game/matching`).toPromise()
    }
}