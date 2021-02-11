import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: any;
  fetchingUser: boolean = true;
  hasLeaderboard: boolean = false;

  private userSubscription: Subscription;
  private leaderboardSubscription: Subscription;

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

  // OnInit: Determine whether leaderboard data is available
  private getLeaderboard() {
    this.leaderboardSubscription = this.gameService.leaderboard.subscribe((_) => {
      this.hasLeaderboard = true;
    });
  }

  ngOnInit() {
    this.getUser();
    this.getLeaderboard();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.leaderboardSubscription.unsubscribe();
  }
}
