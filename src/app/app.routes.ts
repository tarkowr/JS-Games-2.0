import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/Static/page-not-found/page-not-found.component';
import { FlappyComponent } from './components/flappy/flappy.component';
import { MatchingComponent } from './components/matching/matching.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'flappy', component: FlappyComponent },
    { path: 'matching', component: MatchingComponent },
    { path: '**', component: PageNotFoundComponent }
];
