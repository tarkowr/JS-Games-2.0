import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { UserService } from '../../services/user.service';
import { GameService } from '../../services/game.service';
import { storage } from '../../app.constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  games: any[];
  createForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  user: any;
  showForm: boolean = false;
  pageLoaded: boolean = false;

  private userSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private storageService: StorageService,
    private gameService: GameService) { 
  }

  get f() { return this.createForm.controls }

  // On user create form submission
  async onSubmit() {
    this.submitted = true;

    if (this.createForm.invalid) return;

    this.loading = true;

    await this.userService.add(this.f.username.value)
      .then(newUser => {
        this.storageService.set(storage.userId, newUser.id);
        this.userService.user = newUser;
        this.submitted = false;
      })
      .catch(() => {
        this.f.username.setErrors( {'serverError': true} );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  // OnInit: Initialize the create user form
  private buildUserForm() {
    this.createForm = this.formBuilder.group({
      username: ['',  Validators.compose([
        Validators.required, Validators.pattern(/^[a-zA-Z0-9]{1,12}$/)
      ])]
    })
  }

  // OnInit: Get user data
  private getUser() {
    this.userSubscription = this.userService.user.subscribe(user => {
      this.user = user;
    });
  }

  // OnInit: Retrieve scores from database
  private async fetchGameScores() {
    let matchingScores : Array<any> = await this.gameService.getMatching()
      .catch(() => null);
    
    let flappyScores : Array<any> = await this.gameService.getFlappy()
      .catch(() => null);

    this.games = [
      {
        name: 'Matching',
        highScores: matchingScores,
        route: '/matching'
      },
      {
        name: 'Flappy',
        highScores: flappyScores,
        route: '/flappy'
      },
    ];

    this.pageLoaded = true;
  }

  ngOnInit() {
    this.buildUserForm();
    this.getUser();
    this.fetchGameScores();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
