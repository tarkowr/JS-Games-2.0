import { Component } from '@angular/core';
import { UserService } from './services/user.service';
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
    private userService: UserService) { }

  async ngOnInit() {
    this.windowService.checkBreakpoints();
    
    window.addEventListener('resize', () => {
      this.windowService.checkBreakpoints();
    });

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
}
