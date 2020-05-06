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

    blockResults(id: String, gameMode: String, score: Number){
        return this.http.post(`${environment.apiUrl}/game/block/results`, { userId: id, gameMode: gameMode, score: score }).toPromise()
    }

    getBlock(){
        return this.http.get(`${environment.apiUrl}/game/block`).toPromise()
    }
}