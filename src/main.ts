import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { LocalStorage } from './app/services/local-storage';

if (environment.production) {
  enableProdMode();
}

new LocalStorage().SetNullScoresToZero();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
