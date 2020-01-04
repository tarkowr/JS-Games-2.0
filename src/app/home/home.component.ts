import { Component, OnInit } from '@angular/core';
import { Game } from '../models/Game';
import { LocalStorage } from '../services/local-storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  games: Game[];
  localStorage: LocalStorage;

  constructor() { 
    this.localStorage = new LocalStorage();
  }

  getDictionaryLength(dict) {
    return Object.keys(dict).length;
  }

  ngOnInit() {
    this.games = [
      {
        name: 'Block (Easy)',
        highScores: this.localStorage.GetScoreByName(this.localStorage.scores.BlockEasy),
        route: '/block'
      },
      {
        name: 'Block (Hard)',
        highScores: this.localStorage.GetScoreByName(this.localStorage.scores.BlockHard),
        route: '/block'
      },
      {
        name: 'Block (Impossible)',
        highScores: this.localStorage.GetScoreByName(this.localStorage.scores.BlockImpossible),
        route: '/block'
      },
      {
        name: 'Block (Flappy)',
        highScores: this.localStorage.GetScoreByName(this.localStorage.scores.BlockFlappy),
        route: '/block'
      },
      {
        name: 'Matching',
        highScores: this.localStorage.GetScoreByName(this.localStorage.scores.Matching),
        route: '/matching'
      }
    ];

    this.games.forEach(function(game:Game) {
      if (game.highScores[0] === 0){
        game.highScores = [];
      }
    });
  }
}
