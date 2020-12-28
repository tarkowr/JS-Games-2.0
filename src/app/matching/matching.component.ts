import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { GameService } from '../services/game.service';
import { storage } from '../app.constants';

@Component({
  selector: 'app-matching',
  templateUrl: './matching.component.html',
  styleUrls: ['./matching.component.scss']
})
export class MatchingComponent implements OnInit {

  cardNames: string[];
  card: any;
  cards: any;
  deck: any;
  moves: number;
  counter: any;
  bestScore: any;
  modal: any;
  matchedCard: any;
  openedCards: any;
  cardsRemaining: number;
  complete: number;

  constructor(private gameService: GameService,
    private storageService: StorageService) { }

  //
  // Generate a full shuffled list of cards in pairs
  // 
  DoubleListAndShuffle(){
    this.cardNames.forEach((name) => {
      this.cardNames.push(name);
    });
    
    return this.ShuffleCards(this.cardNames);
  }

  //
  // Shuffle the cards
  //
  ShuffleCards(array) {
      let currentIndex = array.length, tempValue, randIndex;

      while (currentIndex !== 0) {
          randIndex = Math.floor(Math.random() * currentIndex); // Get random card index
          currentIndex -= 1;
          tempValue = array[currentIndex]; 
          array[currentIndex] = array[randIndex];
          array[randIndex] = tempValue;
      }
      return array;
  }

  //
  // Start a new game
  //
  StartGame() {      
    this.cards = this.ShuffleCards(this.cards);
    
    for(let i = 0; i < this.cards.length; i++) {
      this.cards[i].classList.remove('show', 'open', 'match', 'disabled');
    }

    this.moves = 0;
    this.cardsRemaining = this.cards.length;
    this.bestScore = undefined;
  }

  //
  // Toggles open/show classes to display cards
  //
  DisplayCard = function(elem: Element) {
      elem.classList.toggle('open');
      elem.classList.toggle('show');
      elem.classList.toggle('disabled');
  };

  //
  // Check if opened cards match
  //
  CardOpen(elem: Element) {
      this.openedCards.push(elem);

      if (this.openedCards.length === 2) {
        this.MoveCounter();

          if (this.openedCards[0].type === this.openedCards[1].type) {
            this.Matched();
          }
          else{
            this.Unmatched();
          }
      }
  };

  //
  // Two opened cards match
  //
  Matched() {
      this.openedCards[0].classList.add('match', 'disabled');
      this.openedCards[1].classList.add('match', 'disabled');
      this.openedCards[0].classList.remove('show', 'open', 'no-event');
      this.openedCards[1].classList.remove('show', 'open', 'no-event');

      this.openedCards = [];
      this.cardsRemaining -=2;
  }

  //
  // Two opened cards do not match
  //
  Unmatched() {
    this.openedCards[0].classList.add('unmatched');
    this.openedCards[1].classList.add('unmatched');
    this.Disable();

    setTimeout(() => {
      this.openedCards[0].classList.remove('show', 'open', 'no-event', 'unmatched');
      this.openedCards[1].classList.remove('show', 'open', 'no-event', 'unmatched');

      this.Enable();
      this.openedCards = [];
    }, 1100);
  }

  //
  // Disable all cards
  //
  Disable() {
      Array.prototype.filter.call(this.cards, (card) => {
          card.classList.add('disabled');
      });
  }

  //
  // Enable unmatched cards
  //
  Enable() {
      Array.prototype.filter.call(this.cards, (card) => {
          card.classList.remove('disabled');
          for(let i = 0; i < this.matchedCard.length; i++) {
              this.matchedCard[i].classList.add('disabled');
          }
      });
  }

  //
  // Count the player's moves
  //
  MoveCounter() {
    this.moves++;
  }

  //
  // Player Wins
  //
  async GameWon() {
      if (this.matchedCard.length === this.complete) {
        let id = this.storageService.get(storage.userId);

        if (id) {
          await this.gameService.saveMatching(id, this.moves)
            .catch((err) => {
              console.log(err);
            });
        }

        this.modal.style.display = 'block';
      }
  }

  //
  // Hide the results modal
  //
  CloseModal(){
    this.modal.style.display = 'none';
  }

  //
  // Add event listener to each card
  //
  HandleCardClick(e: Event) {
    let elem = e.target as Element;

    if (elem.tagName === 'I'){
      elem = elem.parentNode as Element;
    }

    this.DisplayCard(elem);
    this.CardOpen(elem);
    this.GameWon();
  }

  //
  // Restart the game
  //
  OnRestart() {
    location.reload();
  }

  ngOnInit() {

    this.cardNames = ['amazon', 'android', 'apple', 'facebook-square', 'github', 'instagram', 'linkedin-square', 'snapchat', 'windows', 'youtube'];
    this.DoubleListAndShuffle();

    setTimeout(() => {
      this.card = document.getElementsByClassName('boardCard');
      this.cards = Array.from(this.card);
  
      this.deck = document.getElementById('card-deck');
      this.moves = 0;
  
      this.modal = document.getElementById('modal');  
      this.matchedCard = document.getElementsByClassName('match');
      this.openedCards = [];
      this.cardsRemaining = this.cards.length;
  
      this.complete = this.cards.length;
  
      this.StartGame();
    }, 0)
  }

}
