import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User;
  fetchingUser: boolean = true;

  private userSubscription: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userSubscription = this.userService.user.subscribe((user: User) => {
      this.fetchingUser = false;

      if (this.userService.isNotEmpty(user)){
        this.user = user;
      }
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
