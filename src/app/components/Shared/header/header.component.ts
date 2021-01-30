import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  showBackButton: boolean = false;
  private gameNames = ['/flappy', '/matching'];

  constructor(private router: Router, private location: Location) { }

  back() {
    this.location.back();
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.gameNames.includes(event.url)) {
          this.showBackButton = true;
        }
        else {
          this.showBackButton = false;
        }
      }
    });
  }

}
