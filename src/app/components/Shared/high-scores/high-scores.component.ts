import { Component, OnInit, Input } from '@angular/core';
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

  constructor(private gameService: GameService) { }

  // OnInit: Retrieve scores from database
  private async fetchGameScores() {
    let matchingScores : Array<any> = await this.gameService.getMatching()
      .catch(() => null);
    
    let flappyScores : Array<any> = await this.gameService.getFlappy()
      .catch(() => null);

    this.games = [
      {
        name: 'Matching',
        highScores: matchingScores.slice(0, this.count),
      },
      {
        name: 'Flappy',
        highScores: flappyScores.slice(0, this.count),
      },
    ];
  }

  ngOnInit() {
    this.fetchGameScores();
  }

}
