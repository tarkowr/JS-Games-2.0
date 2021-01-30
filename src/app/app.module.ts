import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/Static/page-not-found/page-not-found.component';
import { FlappyComponent } from './components/flappy/flappy.component';
import { MatchingComponent } from './components/matching/matching.component';
import { HeaderComponent } from './components/Shared/header/header.component';
import { NavbarComponent } from './components/Shared/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { GamesComponent } from './components/games/games.component';
import { LeaderboardsComponent } from './components/leaderboards/leaderboards.component';
import { SignupComponent } from './components/Shared/signup/signup.component';
import { HighScoresComponent } from './components/Shared/high-scores/high-scores.component';
import { SpinnerComponent } from './components/Shared/spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    FlappyComponent,
    MatchingComponent,
    HeaderComponent,
    NavbarComponent,
    ProfileComponent,
    GamesComponent,
    LeaderboardsComponent,
    SignupComponent,
    HighScoresComponent,
    SpinnerComponent,
 ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
