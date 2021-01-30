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
  playingSince: string;

  private userSubscription: Subscription;

  constructor(private userService: UserService) { }

  // Convert timestamp (seconds) to date
  private timestampToDate(timestamp:number) {
    return new Date(timestamp * 1000);
  }


  // Format a date time
  private formatDate(date:Date) {
      return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
  }

  ngOnInit() {
    this.userSubscription = this.userService.user.subscribe((user: User) => {
      this.fetchingUser = false;

      if (this.userService.isNotEmpty(user)){
        this.user = user;
        this.playingSince = this.formatDate(this.timestampToDate(this.user.created._seconds));
      }
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
