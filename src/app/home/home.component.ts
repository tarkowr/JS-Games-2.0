import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Game } from '../models/Game';
import { LocalStorage } from '../services/localStorage.service';
import { UserService } from '../services/user.service';
import { GameService } from '../services/game.service';

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
  users: any;
  showForm: Boolean = false;
  pageLoaded: Boolean = false;
  max: Number = 5;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private gameService: GameService) { 
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

  // Populate top scores that have not reached max number
  populateScores(scores){
    while (scores.length < this.max) {
      scores.push({})
    }

    return scores
  }

  // Get username by ID
  lookupUsername(id: Number) {
    let username = '';

    this.users.forEach(u => {
      if (u.id == id) {
        username = u.username;
      }
    })

    return username;
  }

  // Retrieve high scores from firebase
  async fetchGameScores() {
    this.users = await this.userService.getAll()

    let matchingScores = await this.gameService.getMatching()
      .catch(() => {
        return null
      })
    
    let blockScores = await this.gameService.getBlock()
      .catch(() => {
        return null
      })

    this.games = [
      {
        name: 'Matching',
        highScores: this.populateScores(matchingScores),
        route: '/matching'
      },
      {
        name: 'Block (Easy)',
        highScores: this.populateScores(blockScores['easy']),
        route: '/block'
      },
      {
        name: 'Block (Hard)',
        highScores: this.populateScores(blockScores['hard']),
        route: '/block'
      },
      {
        name: 'Block (Impossible)',
        highScores: this.populateScores(blockScores['impossible']),
        route: '/block'
      },
      {
        name: 'Block (Flappy)',
        highScores: this.populateScores(blockScores['flappy']),
        route: '/block'
      },
    ];
  }

  // Initialize the create user form
  buildUserForm() {
    this.createForm = this.formBuilder.group({
      username: ['',  Validators.compose([
        Validators.required, Validators.pattern(/^[a-zA-Z0-9]{1,12}$/)
      ])]
    })
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
    this.buildUserForm();
    this.fetchGameScores();

    this.user = await this.retrieveUser()
    this.pageLoaded = true;
  }
}
