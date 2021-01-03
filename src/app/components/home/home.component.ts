import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { GameService } from '../../services/game.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  games: any[];

  user: any;
  fetchingUser: boolean = true;

  private userSubscription: Subscription;

  constructor(
    private userService: UserService,
    private gameService: GameService) { 
  }

  // OnInit: Get user data
  private getUser() {
    this.userSubscription = this.userService.user.subscribe((user: User) => {
      this.fetchingUser = false;

      if (this.userService.isNotEmpty(user)){
        this.user = user;
      }
    });
  }

  // OnInit: Retrieve scores from database
  private async fetchGameScores() {
    let matchingScores : Array<any> = await this.gameService.getMatching()
      .catch(() => null);
    
    let flappyScores : Array<any> = await this.gameService.getFlappy()
      .catch(() => null);

    this.games = [
      {
        name: 'Matching',
        highScores: matchingScores,
        route: '/matching'
      },
      {
        name: 'Flappy',
        highScores: flappyScores,
        route: '/flappy'
      },
    ];
  }

  ngOnInit() {
    this.getUser();
    this.fetchGameScores();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
