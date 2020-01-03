import { Component, OnInit } from '@angular/core';
import { Game } from '../models/Game';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  games: Array<Game>;

  constructor() { }

  getDictionaryLength(dict) {
    return Object.keys(dict).length;
  }

  ngOnInit() {
    this.games = [
      {
        name: 'Block (Easy)',
        highScores: {},
        route: '/block'
      },
      {
        name: 'Block (Hard)',
        highScores: {},
        route: '/block'
      },
      {
        name: 'Block (Impossible)',
        highScores: {},
        route: '/block'
      },
      {
        name: 'Block (Flappy)',
        highScores: {},
        route: '/block'
      },
      {
        name: 'Matching',
        highScores: {},
        route: '/matching'
      }
    ];
  }

}
