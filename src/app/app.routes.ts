import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FlappyComponent } from './flappy/flappy.component';
import { MatchingComponent } from './matching/matching.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'flappy', component: FlappyComponent },
    { path: 'matching', component: MatchingComponent },
    { path: '**', component: PageNotFoundComponent }
];
