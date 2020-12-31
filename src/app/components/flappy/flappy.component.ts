import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { GameService } from '../../services/game.service';
import { WindowService } from '../../services/window.service';
import { app, storage } from '../../app.constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-flappy',
  templateUrl: './flappy.component.html',
  styleUrls: ['./flappy.component.scss']
})
export class FlappyComponent implements OnInit {
  private gameArea: any;
  private gamePiece: any;
  private obstacles = [];
  private passedObstacles = [];
  clicked: boolean = false;
  gameEnd: boolean = false;
  score: number = 0;

  private barMaxHeight: number;
  private barMinHeight: number;
  private barGap: number = 160;
  private barGapRange: number = 30; // Larger number will create smaller spread
  private barMovementSpeed: number = -6;

  private updateGameInterval: number = 20;
  private addObstacleInterval: number = 50;

  private gravity: number = 0;
  private velocity: number = 0.24;

  private mobile: Boolean = true;
  private windowSubscription: Subscription;

  private canvasHeight: number = 400;

  private get canvasWidth() : number {
    return this.mobile ? window.innerWidth - 20 : 720;
  }

  constructor(private gameService: GameService,
    private windowService: WindowService,
    private storageService: StorageService) {}

  startGame() {
    this.gamePiece = this.component(45, 45, '#FF247F', 75, 180);
    this.gameEnd = false;
    this.gameArea.start();
  }

  restartGame() {
    this.gameArea.clear();

    this.gamePiece = null;
    this.obstacles = [];
    this.passedObstacles = [];
    this.score = 0;
    this.gravity = 0;

    this.startGame();
  }

  //
  // Returns whether the current frame corresponds with the given interval n
  //
  private everyinterval(n) : boolean {
    return (this.gameArea.frameNo / n) % 1 === 0;
  }

  //
  // Setup the HTML canvas and game pieces
  //
  private createGameArea(updateArea, updateInterval) {
    const gameContext = this;

    this.gameArea = {

      canvas : document.getElementById('board'), // Canvas Object
      key : new Object(),
      frameNo : 0,
      context : new Object(),

      start() {
          this.canvas.width = gameContext.canvasWidth;
          this.canvas.height = gameContext.canvasHeight;

          this.context = this.canvas.getContext('2d');
          this.canvas.classList.remove('d-none');

          this.frameNo = 0;
          this.interval = setInterval(updateArea, updateInterval);
      },

      //
      // Clears the canvas to redraw the screen
      //
      clear() {
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      },

      stop() {
        gameContext.gameEnd = true;
        clearInterval(this.interval);
      }
    };
  }

  //
  // Builds a new game piece
  //
  private component(width, height, color, x, y) : any {
    const gameContext = this;

    return {
      width, height, color, speedY : 0, x, y,

      update() {
          const ctx: any = gameContext.gameArea.context;

          ctx.fillStyle = color;
          ctx.fillRect(this.x, this.y, this.width, this.height);
      },

      newPos() {
        this.y += this.speedY;
      },

      crashWith(otherObj) : boolean {
        const myleft = this.x;
        const myright = this.x + (this.width);
        const mytop = this.y;
        const mybottom = this.y + (this.height);
        const otherleft = otherObj.x;
        const otherright = otherObj.x + (otherObj.width);
        const othertop = otherObj.y;
        const otherbottom = otherObj.y + (otherObj.height);

        return !((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright));
      },

      outOfBounds() : boolean {
        return this.y < 0 || this.y > 360;
      }
    };
  }

  //
  // Called to update the game board on each frame
  //
  private updateGameArea() {
    if (this.hasCrashed()) {
      this.gameArea.stop();
      this.saveScore();
      return;
    }

    this.gameArea.clear();
    this.gameArea.frameNo += 1;

    this.updateObstacles();
    this.updateScore();
    this.updatePiecePosition();
  }

  //
  // Determine whether the player has crashed
  //
  private hasCrashed() : boolean {
    if (this.gamePiece.outOfBounds()) {
      return true;
    }

    if (this.obstacles.length >= 2) {
      if (this.gamePiece.crashWith(this.obstacles[0]) || 
        this.gamePiece.crashWith(this.obstacles[1])) {
        return true;
      }
    }

    if (this.passedObstacles.length >= 2) {
      if (this.gamePiece.crashWith(this.passedObstacles[0]) || 
        this.gamePiece.crashWith(this.passedObstacles[1])) {
        return true;
      }
    }

    return false;
  }

  private updateObstacles() {
    //
    // Add a new obstacle
    //
    if (this.everyinterval(this.addObstacleInterval)) {
      let x = this.gameArea.canvas.width;
      let minHeight = this.barMinHeight;
      let maxHeight = this.barMaxHeight;
      let gap = this.barGap;
      let heightUpper = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
      let heightLower = x - heightUpper - gap;
      let width = 20;
      let color = '#0E425F';
      let yUpper = 0;
      let yLower = heightUpper + gap;

      if (this.mobile) heightLower += Math.abs(x - heightUpper)

      this.obstacles.push(this.component(width, heightUpper, color, x, yUpper)); // top
      this.obstacles.push(this.component(width, heightLower, color, x, yLower)); // bottom
    }

    //
    // Change each obstacle's position
    //
    for (let i = 0; i < this.passedObstacles.length; i++) {
      this.passedObstacles[i].x += this.barMovementSpeed;
      this.passedObstacles[i].update();
    }

    for (let i = 0; i < this.obstacles.length; i++) {
        this.obstacles[i].x += this.barMovementSpeed;
        this.obstacles[i].update();
    }
  }

  private updateScore() {
    if (this.obstacles.length < 2) return;

    if (this.gamePiece.x > this.obstacles[0].x) {
      this.passedObstacles = [this.obstacles[0], this.obstacles[1]];
      this.obstacles = this.obstacles.slice(2);
      this.score += 1;
    } 
  }

  private updatePiecePosition() {
    this.gamePiece.speedY = 0;

    if (this.clicked) {
      this.gravity = -6;
      this.gamePiece.speedY = this.gravity;
      this.clicked = false;
    } else {
      this.gamePiece.speedY = this.gravity;
      this.gravity = this.gravity + ((this.gravity < 0) ? this.velocity * 2 : this.velocity); // Add to Gravity Pull Effect
    }

    this.gamePiece.newPos();
    this.gamePiece.update();
  }

  private saveScore() {
    let userId = this.storageService.get(storage.userId);

    if (userId && this.score >= app.minScores.flappy){
      this.gameService.saveFlappy(userId, this.score)
        .catch((err) => {
          console.error('Unable to save game score!', err);
        });
    }
  }

  //
  // UI: When canvas is clicked/tapped by the player
  //
  canvasClicked(e) {
    this.clicked = true;
  }

  private handleScreenSize(){    
    this.windowSubscription = this.windowService.large.subscribe(isMobile => {
      this.mobile = isMobile;
    });
  }

  private setBarSize() {
    this.barMaxHeight = this.canvasHeight - this.barGap - this.barGapRange;
    this.barMinHeight = this.barGapRange;
  }

  ngOnInit() {
    this.handleScreenSize();
    this.setBarSize();

    this.createGameArea(this.updateGameArea.bind(this), this.updateGameInterval);
    this.startGame();
  }

  ngOnDestroy() {
    this.windowSubscription.unsubscribe();
  }
}
