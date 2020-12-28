import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { GameService } from '../services/game.service';
import { storage } from '../app.constants';

@Component({
  selector: 'app-flappy',
  templateUrl: './flappy.component.html',
  styleUrls: ['./flappy.component.scss']
})
export class FlappyComponent implements OnInit {
  private canvasWidth: number;
  private canvasHeight: number;

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

  //private jump: number = -50;
  private gravity: number = 0;
  private velocity: number = 0.24;

  private gameArea: any;

  private updateGameMethod: any;
  //private createGameAreaMethod: any;

  private mobile: Boolean = false;
  private breakpoint = 992;
  caption: string;

  constructor(private gameService: GameService,
    private storageService: StorageService) {}

  startGame() {
    this.gamePiece = this.component(45, 45, '#f43030', 75, 180, 'piece');
    this.gameEnd = false;

    this.gameArea.start();
  }

  restartGame() {
    this.gameArea.clear();

    for (const member in this.gamePiece) {
      if (member) {
        delete this.gamePiece[member];
      }
    }

    this.obstacles = [];
    this.passedObstacles = [];
    this.score = 0;
    this.gravity = 0;

    this.setCanvasSize();
    this.startGame();
  }

  //
  // Frame Tracker
  // Returns true if the current framenumber (frameNo) corresponds with the given interval (n)
  //
  everyinterval(n) {
    if ((this.gameArea.frameNo / n) % 1 === 0) {
        return true;
    }
    return false;
  }

  //
  // Creates the Canvas
  //
  createGameArea(updateArea, updateInterval) {
    const gameContext = this;

    gameContext.gameArea = {

      canvas : document.getElementById('board'), // Canvas Object
      key : new Object(),
      frameNo : 0,
      context : new Object(),

      //
      // Setup the Game
      //
      start() {
          this.canvas.width = gameContext.canvasWidth;
          this.canvas.height = gameContext.canvasHeight;

          this.context = this.canvas.getContext('2d');
          this.canvas.classList.remove('d-none');

          this.frameNo = 0;
          this.interval = setInterval(updateArea, updateInterval);
      },

      //
      // Clear the Screen to re-draw
      //
      clear() {
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      },

      //
      // Stop the Game
      //
      stop() {
        gameContext.gameEnd = true;
        clearInterval(this.interval);
      }
    };
  }

  //
  // Returns new game piece
  //
  component(width, height, color, x, y, type) {
    const gameContext = this;

    return {
      type, width, height, color, speedY : 0, x, y,

      //
      // Update GamePiece and Score
      //
      update() {
          const ctx: any = gameContext.gameArea.context;

          ctx.fillStyle = color;
          ctx.fillRect(this.x, this.y, this.width, this.height);
      },

      //
      // Update Game Piece New Position
      //
      newPos() {
        this.y += this.speedY;
      },

      //
      // Check if Player has Crashed
      //
      crashWith(otherObj) {
          const myleft = this.x;
          const myright = this.x + (this.width);
          const mytop = this.y;
          const mybottom = this.y + (this.height);
          const otherleft = otherObj.x;
          const otherright = otherObj.x + (otherObj.width);
          const othertop = otherObj.y;
          const otherbottom = otherObj.y + (otherObj.height);
          let crash = true;

          if ((mybottom < othertop) ||
              (mytop > otherbottom) ||
              (myright < otherleft) ||
              (myleft > otherright)) {
            crash = false;
          }

          //
          // If game piece hits bounds
          //
          if (this.y < 0 || this.y > 360) {
              crash = true;
          }

          return crash;
      }
    };
  }

  //
  // Clear screen and re-draw when called
  //
  updateGameArea() {
    let x;
    let yUpper;
    let yLower;
    let heightUpper;
    let heightLower;
    let width;
    let gap;
    let minHeight;
    let maxHeight;
    let color;

    //
    // Check if Player Crashed
    //
    for (let i = 0; i < this.obstacles.length; i++) {
        if (this.gamePiece.crashWith(this.obstacles[i])) {
            this.gameArea.stop();

            let id = this.storageService.get(storage.userId);

            if (id){
              this.gameService.saveFlappy(id, this.score)
                .catch((err) => {
                  console.log(err)
                });
            }

            return;
        }
    }

    //
    // Clear Screen and Add 1 to Frame Count
    //
    this.gameArea.clear();
    this.gameArea.frameNo += 1;

    //
    // Add a new Obstacle to the game on Interval
    //
    if (this.everyinterval(this.addObstacleInterval)) {
        x = this.gameArea.canvas.width;
        minHeight = this.barMinHeight;
        maxHeight = this.barMaxHeight;
        gap = this.barGap;
        heightUpper = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        heightLower = x - heightUpper - gap;
        width = 20;
        color = '#4286f4';
        yUpper = 0;
        yLower = heightUpper + gap;

        if (this.mobile) heightLower += Math.abs(x - heightUpper)

        this.obstacles.push(this.component(width, heightUpper, color, x, yUpper, 'obstacle')); // top
        this.obstacles.push(this.component(width, heightLower, color, x, yLower, 'obstacle')); // bottom
    }

    //
    // Change Obstacle Position
    //
    for (let i = 0; i < this.obstacles.length; i++) {
        this.obstacles[i].x += this.barMovementSpeed;

        //
        // Add passed obstacles to an array to track player score
        //
        if (this.gamePiece.x > this.obstacles[i].x && !this.passedObstacles.includes(this.obstacles[i])) {
          this.passedObstacles.push(this.obstacles[i]);
          this.score = this.passedObstacles.length / 2; // Two bars are passed at the same time
        }

        this.obstacles[i].update();
    }

    // Remove older obstacles
    if (this.obstacles.length > 10) {
      this.obstacles.splice(0, 6);
    }

    this.gamePiece.speedY = 0;

    //
    // Change game piece Y movement based on arrow keys
    //
        if (this.clicked) {
          this.gravity = -6;
          this.gamePiece.speedY = this.gravity;
          this.clicked = false;
        } else {
          this.gamePiece.speedY = this.gravity; // Apply Gravity
          this.gravity = this.gravity + ((this.gravity < 0) ? this.velocity * 2 : this.velocity); // Add to Gravity Pull Effect
        }

    this.gamePiece.newPos();
    this.gamePiece.update();
  }

  //
  // Handle canvas click
  //
  canvasClicked(e) {
    this.clicked = true;
  }

  //
  // Set the canvas size
  //
  setCanvasSize(){
    if(window.innerWidth < this.breakpoint) this.mobile = true;
    else this.mobile = false;

    if (!this.mobile){
      this.canvasWidth = 720;
    }
    else {
      this.canvasWidth = window.innerWidth - 20;
    }

    this.canvasHeight = 400;
  }

  //
  // Initialize variables with default values
  //
  setDefaults() {
    this.barMaxHeight = this.canvasHeight - this.barGap - this.barGapRange;
    this.barMinHeight = this.barGapRange;
  }

  ngOnInit() {
    this.setCanvasSize();
    this.setDefaults();

    this.updateGameMethod = this.updateGameArea.bind(this);
    this.createGameArea(this.updateGameMethod, this.updateGameInterval);
    this.startGame();
  }
}
