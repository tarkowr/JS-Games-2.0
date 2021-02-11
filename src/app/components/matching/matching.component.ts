import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { GameService } from '../../services/game.service';
import { storage } from '../../app.constants';

@Component({
  selector: 'app-matching',
  templateUrl: './matching.component.html',
  styleUrls: ['./matching.component.scss']
})
export class MatchingComponent implements OnInit {

  moves: number = 0;
  cardsRemaining: number;
  cardNames: string[] = ['amazon', 'android', 'apple', 'facebook-square', 'instagram', 'reddit', 'snapchat', 'twitter-square', 'windows', 'youtube'];
  private cards: Element[] = [];
  private modal: HTMLElement;
  private openedCards: Element[] = [];

  private startTimeout: any;
  private showTimeout: any;

  private get matchedCards() : HTMLCollection {
    return document.getElementsByClassName('match');
  }
  
  private get hasWonGame() : boolean {
    return this.matchedCards.length === this.cards.length;
  }

  constructor(private gameService: GameService,
    private storageService: StorageService) { }

  private shuffle(array) {
      let currentIndex = array.length, tempValue, randIndex;

      while (currentIndex !== 0) {
          randIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          tempValue = array[currentIndex]; 
          array[currentIndex] = array[randIndex];
          array[randIndex] = tempValue;
      }

      return array;
  }

  private forEachCard(callback: (card: Element) => any) {
    Array.prototype.filter.call(this.cards, (card: Element) => callback(card));
  }

  private startGame() { 
    this.startTimeout = setTimeout(() => {
      this.cards = Array.from(document.getElementsByClassName('boardCard'));
  
      this.moves = 0;
      this.openedCards = [];
      this.cardsRemaining = this.cards.length;
      this.modal = document.getElementById('end-modal');  

      this.forEachCard((card: Element) => card.classList.remove('match'));
    }, 500);
  }

  private displayCard = function(elem: Element) {
      elem.classList.toggle('open');
      elem.classList.toggle('show');
      elem.classList.toggle('disabled');
  };

  private onCardOpen(elem: Element) {
      this.openedCards.push(elem);

      if (this.openedCards.length === 2) {
        this.moves++;

        if (this.openedCards[0].id === this.openedCards[1].id) {
          this.onMatch();
          return;
        }
        
        this.onNoMatch();
      }
  };

  //
  // Two opened cards match
  //
  private onMatch() {
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
  private onNoMatch() {
    this.openedCards[0].classList.add('unmatched');
    this.openedCards[1].classList.add('unmatched');
    this.disableDeck();

    this.showTimeout = setTimeout(() => {
      this.openedCards[0].classList.remove('show', 'open', 'no-event', 'unmatched');
      this.openedCards[1].classList.remove('show', 'open', 'no-event', 'unmatched');

      this.reEnableDeck();
      this.openedCards = [];
    }, 1200);
  }

  private disableDeck() {
    this.forEachCard((card: Element) => card.classList.add('disabled'));
  }

  private reEnableDeck() {
    this.forEachCard((card: Element) => card.classList.remove('disabled'));
    Array.prototype.filter.call(this.matchedCards, (card: Element) => {
      card.classList.add('disabled');
    });
  }

  private onGameWin() {
    let id = this.storageService.get(storage.userId);

    if (id) {
      this.gameService.saveMatching(id, this.moves)
        .catch((err) => {
          console.log(err);
        });
    }

    this.modal.style.display = 'block';
  }

  closeModal(){
    this.modal.style.display = 'none';
  }

  //
  // Click event handler on each card
  //
  handleCardClick(e: Event) {
    if (this.cards.length == 0) return;

    let elem = e.target as Element;

    if (elem.tagName === 'I'){
      elem = elem.parentNode as Element;
    }

    this.displayCard(elem);
    this.onCardOpen(elem);

    if (this.hasWonGame) this.onGameWin();
  }

  restart() {
    this.closeModal();
    clearTimeout(this.startTimeout);
    clearTimeout(this.showTimeout);

    this.cardNames = this.shuffle(this.cardNames);

    this.forEachCard((card: Element) => {
      card.classList.remove('show', 'open', 'disabled', 'no-event', 'unmatched');
      card.classList.add('match');
    });

    this.cards = [];
    this.startGame();
  }

  ngOnInit() {
    this.cardNames = this.shuffle(this.cardNames.concat(this.cardNames));    
    this.startGame();
  }
}
