import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Leaderboard } from 'src/app/models/leaderboard';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-high-scores',
  templateUrl: './high-scores.component.html',
  styleUrls: ['./high-scores.component.scss']
})
export class HighScoresComponent implements OnInit {

  @Input() label: string;
  @Input() count: number;

  games: any[];
  
  private leaderboardSubscription: Subscription;
  private canFetchLeaderboard: boolean = true;

  constructor(private gameService: GameService) { }

  fetchLeaderboard() {
    if (!this.canFetchLeaderboard) return;

    this.gameService.fetchLeaderboard();
    this.games = null;
    this.canFetchLeaderboard = false;
    
    setTimeout(() => {
      this.canFetchLeaderboard = true;
    }, 10000);
  }

  private getLeaderboard() {
    this.leaderboardSubscription = this.gameService.leaderboard.subscribe((lboard: Leaderboard) => {
      this.games = [
        {
          name: 'Matching',
          highScores: lboard.matching ? lboard.matching.slice(0, this.count) : null,
        },
        {
          name: 'Flappy',
          highScores: lboard.flappy ? lboard.flappy.slice(0, this.count) : null,
        },
      ];
    });
  }

  ngOnDestroy() {
    this.leaderboardSubscription.unsubscribe();
  }

  ngOnInit() {
    this.getLeaderboard();
  }

}
