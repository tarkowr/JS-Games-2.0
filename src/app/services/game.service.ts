import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ReplaySubject } from 'rxjs';
import { HighScore } from '../models/high-score';
import { Leaderboard } from '../models/leaderboard';
import { Game } from '../models/game';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private _leaderboard: ReplaySubject<any>;

    constructor(private http: HttpClient) { 
        this._leaderboard = new ReplaySubject<any>(1);
    }

    get leaderboard() : any {
        return this._leaderboard.asObservable();
    }

    set leaderboard(user: any) {
        this._leaderboard.next(user);
    }

    get games() : Game[] {
        return [
            {
                name: 'Flappy',
                description: 'Like Flappy Birds... but better',
                path: '/flappy'
            },
            {
                name: 'Matching',
                description: 'Match all of the cards',
                path: '/matching'
            }
        ];
    }

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

    // Fetch scores and cache results
    async fetchLeaderboard() {
        let matchingScores : Array<HighScore> = await this.getMatching()
        .catch(() => null);
    
      let flappyScores : Array<HighScore> = await this.getFlappy()
        .catch(() => null);
  
      let leaderboard: Leaderboard = {
        flappy: flappyScores,
        matching: matchingScores,
      };
  
      this.leaderboard = leaderboard;
    }
}