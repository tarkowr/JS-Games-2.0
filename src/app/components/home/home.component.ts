import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: any;
  fetchingUser: boolean = true;

  private userSubscription: Subscription;

  constructor(
    private userService: UserService) { 
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

  ngOnInit() {
    this.getUser();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
