import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    constructor(private http: HttpClient) { }

    // Fetch matching scores
    getMatching() : Promise<any> {
        return this.http.get(`${environment.apiUrl}/api/matching`).toPromise();
    }

    // Save matching score
    saveMatching(userId: string, score: number) : Promise<any> {
        return this.http.post(`${environment.apiUrl}/api/matching`, { userId: userId, score: score }).toPromise();
    }

    // Fetch flappy scores
    getFlappy() : Promise<any> {
        return this.http.get(`${environment.apiUrl}/api/flappy`).toPromise();
    }

    // Save flappy score
    saveFlappy(userId: string, score: number) : Promise<any> {
        return this.http.post(`${environment.apiUrl}/api/flappy`, { userId: userId, score: score }).toPromise();
    }
}