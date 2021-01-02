import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/Static/page-not-found/page-not-found.component';
import { FlappyComponent } from './components/flappy/flappy.component';
import { MatchingComponent } from './components/matching/matching.component';
import { GamesComponent } from './components/games/games.component';
import { LeaderboardsComponent } from './components/leaderboards/leaderboards.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'games', component: GamesComponent },
    { path: 'leaderboards', component: LeaderboardsComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'flappy', component: FlappyComponent },
    { path: 'matching', component: MatchingComponent },
    { path: '**', component: PageNotFoundComponent }
];
