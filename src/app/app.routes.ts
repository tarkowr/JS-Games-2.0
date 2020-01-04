import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BlockComponent } from './block/block.component';
import { SettingsComponent } from './settings/settings.component';
import { MatchingComponent } from './matching/matching.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'block', component: BlockComponent },
    { path: 'matching', component: MatchingComponent },
    { path: 'settings', component: SettingsComponent },
    { path: '**', component: PageNotFoundComponent }
];
