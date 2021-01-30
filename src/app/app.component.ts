import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { GameService } from './services/game.service';
import { StorageService } from './services/storage.service';
import { WindowService } from './services/window.service';
import { storage } from './app.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Bloxii';

  constructor(private windowService: WindowService,
    private storageService: StorageService,
    private gameService: GameService,
    private userService: UserService) { }

  private async fetchUser() {
    const id = this.storageService.get(storage.userId);

    if (id) {
      let user = await this.userService.get(id)
        .catch(() => null);

      if (user) {
        this.userService.user = user;
        return;
      }
    }

    this.userService.user = {};
  }

  async ngOnInit() {
    this.windowService.checkBreakpoints();
    
    window.addEventListener('resize', () => {
      this.windowService.checkBreakpoints();
    });

    this.fetchUser();
    this.gameService.fetchLeaderboard();
  }
}
