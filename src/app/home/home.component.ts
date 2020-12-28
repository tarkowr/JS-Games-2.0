import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Game } from '../models/game';
import { StorageService } from '../services/storage.service';
import { UserService } from '../services/user.service';
import { GameService } from '../services/game.service';
import { storage } from '../app.constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  games: Game[];
  createForm: FormGroup;
  submitted: Boolean = false;
  loading: Boolean = false;
  user: any;
  showForm: Boolean = false;
  pageLoaded: Boolean = false;
  max: Number = 5;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private storageService: StorageService,
    private gameService: GameService) { 
  }

  get f() { return this.createForm.controls }

  getDictionaryLength(dict) {
    return Object.keys(dict).length;
  }

  // On user create form submission
  async onSubmit() {
    this.submitted = true;

    if (this.createForm.invalid){
      return;
    }

    this.loading = true;

    this.user = await this.userService.add(this.f.username.value)
      .then(data => {
        this.storageService.set(storage.userId, data.id);
        this.submitted = false;
        return data
      })
      .catch(() => {
        this.f.username.setErrors( {'serverError': true} )
      })
      .finally(() => {
        this.loading = false;
      })
  }

  // OnInit: Initialize the create user form
  private buildUserForm() {
    this.createForm = this.formBuilder.group({
      username: ['',  Validators.compose([
        Validators.required, Validators.pattern(/^[a-zA-Z0-9]{1,12}$/)
      ])]
    })
  }

  // OnInit: Fetch user data
  private async getUser() {
    const id = this.storageService.get(storage.userId);

    if (id) {
      this.user = await this.userService.get(id)
        .catch((err) => {
          console.log(err);
          return null;
        });

      console.log(this.user);
    }
  }

  // OnInit: Retrieve scores from database
  private async fetchGameScores() {
    let matchingScores : Array<any> = await this.gameService.getMatching()
      .catch(() => {
        return null
      });

    console.log(matchingScores)
    
    let blockScores : Array<any> = await this.gameService.getFlappy()
      .catch(() => {
        return null
      });

    console.log(blockScores)

    this.games = [
      {
        name: 'Matching',
        highScores: matchingScores,
        route: '/matching'
      },
      {
        name: 'Flappy',
        highScores: blockScores,
        route: '/flappy'
      },
    ];
  }

  async ngOnInit() {
    this.buildUserForm();
    await this.getUser();
    await this.fetchGameScores();

    this.pageLoaded = true;
  }
}
