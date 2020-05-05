import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Game } from '../models/Game';
import { LocalStorage } from '../services/local-storage';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  games: Game[];
  localStorage: LocalStorage;
  createForm: FormGroup;
  submitted: Boolean = false;
  loading: Boolean = false;
  user: any;
  showForm: Boolean = false;
  pageLoaded: Boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService) { 
    this.localStorage = new LocalStorage();
  }

  getDictionaryLength(dict) {
    return Object.keys(dict).length;
  }

  get f() { return this.createForm.controls }

  // Get user ID from localstorage and get user from firebase
  retrieveUser() {
    const id = this.localStorage.GetUser();

    if (!id) return null;

    return this.userService.get(id);
  }

  hideEmptyScores(){
    this.games.forEach(function(game:Game) {
      if (game.highScores[0] === 0){
        game.highScores = [];
      }
    });
  }

  fetchGameScores() {
    this.games = [
      {
        name: 'Block (Easy)',
        highScores: this.localStorage.GetScoreByName(this.localStorage.scores.BlockEasy),
        route: '/block'
      },
      {
        name: 'Block (Hard)',
        highScores: this.localStorage.GetScoreByName(this.localStorage.scores.BlockHard),
        route: '/block'
      },
      {
        name: 'Block (Impossible)',
        highScores: this.localStorage.GetScoreByName(this.localStorage.scores.BlockImpossible),
        route: '/block'
      },
      {
        name: 'Block (Flappy)',
        highScores: this.localStorage.GetScoreByName(this.localStorage.scores.BlockFlappy),
        route: '/block'
      },
      {
        name: 'Matching',
        highScores: this.localStorage.GetScoreByName(this.localStorage.scores.Matching),
        route: '/matching'
      }
    ];
  }

  // On user create form submission
  async onSubmit() {
    this.submitted = true;

    if (this.createForm.invalid){
      return;
    }

    this.loading = true;

    this.user = await this.userService.create(this.f.username.value)
      .then(data => {
        this.localStorage.SetUser(data['id'])
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

  async ngOnInit() {

    this.createForm = this.formBuilder.group({
      username: ['',  Validators.compose([
        Validators.required, Validators.pattern(/^[a-zA-Z0-9]{1,12}$/)
      ])]
    })

    this.fetchGameScores();
    this.hideEmptyScores();

    this.user = await this.retrieveUser()
    this.pageLoaded = true;
  }
}
