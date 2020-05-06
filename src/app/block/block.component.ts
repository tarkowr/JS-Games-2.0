import { Component, OnInit } from '@angular/core';
import { LocalStorage } from '../services/localStorage.service';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {

  GameModes: any;
  GameKeys: any;
  CanvasWidth: number;
  CanvasHeight: number;

  myGamePiece: any;
  myObstacles = [];
  myScore: any;
  scoreValue: number;
  passedObstacles = [];
  gameMode: string;
  clicked: boolean;
  playing: boolean;
  gameEnd: boolean;

  barMaxHeight: number;
  barMinHeight: number;
  barMaxGap: number;
  barMinGap: number;

  updateGameInterval: number; // Milliseconds
  addObstacleInterval: number; // Milliseconds

  barMovementSpeed: number;

  blockUpKey: number;
  blockDownKey: number;

  spacePress: number;
  clickCanvas: number;
  gravity: number;
  gravitySpeed: number;

  myGameArea: any;

  updateGameMethod: any;
  createGameAreaMethod: any;

  localStorage: LocalStorage;

  constructor() {
    this.localStorage = new LocalStorage();
  }

  //
  // Setup game variables and high score
  //
  SetupGame(mode) {
    this.gameMode = mode;
    this.GameSettings(mode);
    this.startGame();
  }

  //
  // Apply settings based on game mode
  //
  GameSettings(mode) {
    switch (mode) {
        case this.GameModes.BlockEasy:
            this.GameDifficultyEasy();
            break;
        case this.GameModes.BlockHard:
            this.GameDifficultyHard();
            break;
        case this.GameModes.BlockImpossible:
            this.GameDifficultyImpossible();
            break;
        default:
            this.GameDifficultyFlappy();
            break;
    }
  }

  //
  // Settings For Game Difficulty Easy
  //
  GameDifficultyEasy() {
    this.barMaxGap = 140;
    this.barMinGap = 140;
    this.barMaxHeight = this.CanvasHeight - this.barMaxGap;
    this.barMinHeight = 30;

    this.updateGameInterval = 10; // Milliseconds
    this.addObstacleInterval = 100; // Milliseconds

    this.barMovementSpeed = -3;

    this.blockUpKey = -3;
    this.blockDownKey = 3;
  }

  //
  // Settings for Game Difficulty Hard
  //
  GameDifficultyHard() {
    this.barMaxGap = 110;
    this.barMinGap = 110;
    this.barMaxHeight = this.CanvasHeight - this.barMaxGap;
    this.barMinHeight = 30;

    this.updateGameInterval = 10; // Milliseconds
    this.addObstacleInterval = 70; // Milliseconds

    this.barMovementSpeed = -4;

    this.blockUpKey = -4;
    this.blockDownKey = 4;
  }

  //
  // Settings for Game Difficulty Impossible
  //
  GameDifficultyImpossible() {
    this.barMaxGap = 100;
    this.barMinGap = 100;
    this.barMaxHeight = this.CanvasHeight - this.barMaxGap;
    this.barMinHeight = 30;

    this.updateGameInterval = 10; // Milliseconds
    this.addObstacleInterval = 50; // Milliseconds

    this.barMovementSpeed = -5;

    this.blockUpKey = -5;
    this.blockDownKey = 5;
  }

  //
  // Settings for Game Difficulty Flappy
  //
  GameDifficultyFlappy() {
    this.barMaxGap = 160;
    this.barMinGap = 160;
    this.barMaxHeight = this.CanvasHeight - this.barMaxGap;
    this.barMinHeight = 30;

    this.updateGameInterval = 10; // Milliseconds
    this.addObstacleInterval = 100; // Milliseconds

    this.barMovementSpeed = -3;

    this.spacePress = -6;
    this.gravity = 0;
    this.gravitySpeed = .08;
  }

  //
  // Execute to Start Game
  //
  startGame() {
    this.myGamePiece = this.component(45, 45, '#f43030', 75, 180, ''); // Instantiate new Game Component -- 30,30
    this.myScore = this.component('30px', 'Consolas', 'black', 500, 40, 'text');
    this.playing = true;
    this.gameEnd = false;

    this.myGameArea.start();
  }

  //
  // Restart Game
  //
  restartGame() {
    this.myGameArea.clear();

    for (const member in this.myGamePiece) {
      if (member) {
        delete this.myGamePiece[member];
      }
    }

    this.myObstacles = [];
    this.passedObstacles = [];
    this.myScore = '';
    this.scoreValue = 0;
    this.gravity = 0;

    this.startGame();
  }

  //
  // Reload the page
  //
  reloadPage() {
    location.reload();
  }

  //
  // Frame Tracker
  // Returns true if the current framenumber (frameNo) corresponds with the given interval (n)
  //
  everyinterval(n) {
    if ((this.myGameArea.frameNo / n) % 1 === 0) {
        return true;
    }
    return false;
  }

  //
  // Creates the Canvas
  //
  createGameArea(updateArea, updateInterval) {
    const gameContext = this;

    gameContext.myGameArea = {

      canvas : document.getElementById('board'), // Canvas Object
      key : new Object(),
      frameNo : 0,
      context : new Object(),

      //
      // Setup the Game
      //
      start() {
          this.canvas.width = gameContext.CanvasWidth;
          this.canvas.height = gameContext.CanvasHeight;

          this.context = this.canvas.getContext('2d');
          this.canvas.classList.remove('d-none');

          this.frameNo = 0; // Count frames
          this.interval = setInterval(updateArea, updateInterval); // Runs function updateGameArea X times a second

          //
          // Get Key on Key Press
          //
          window.addEventListener('keydown', (e) => {
            this.key = e.key;
          });
          window.addEventListener('keyup', (e) => {
            this.key = false;
          });
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
          const ctx: any = gameContext.myGameArea.context;

          if (this.type === 'text') { // Score
              ctx.font = this.width + ' ' + this.height;
              ctx.fillStyle = color;
              ctx.fillText(this.text, this.x, this.y);
          } else { // GamePiece
              ctx.fillStyle = color;
              ctx.fillRect(this.x, this.y, this.width, this.height);
          }
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
    let height;
    let gap;
    let minHeight;
    let maxHeight;
    let minGap;
    let maxGap;

    //
    // Check if Player Crashed
    //
    for (let i = 0; i < this.myObstacles.length; i++) {
        if (this.myGamePiece.crashWith(this.myObstacles[i])) {
            this.myGameArea.stop();

            let id = this.localStorage.GetUser()

            if (id){
              // Send gameMode, scoreValue, and id to server to store in firebase
            }

            return;
        }
    }

    //
    // Clear Screen and Add 1 to Frame Count
    //
    this.myGameArea.clear();
    this.myGameArea.frameNo += 1;

    //
    // Add a new Obstacle to the game on Interval
    //
    if (this.myGameArea.frameNo === 1 || this.everyinterval(this.addObstacleInterval)) {
        x = this.myGameArea.canvas.width;
        minHeight = this.barMinHeight;
        maxHeight = this.barMaxHeight;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = this.barMinGap;
        maxGap = this.barMaxGap;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);

        this.myObstacles.push(this.component(20, height, '#4286f4', x, 0, ''));
        this.myObstacles.push(this.component(20, x - height - gap, '#4286f4', x, height + gap, ''));
    }

    //
    // Change Obstacle Position
    //
    for (let i = 0; i < this.myObstacles.length; i += 1) {
        this.myObstacles[i].x += this.barMovementSpeed;

        //
        // Add passed obstacles to an array to track player score
        //
        if (this.myGamePiece.x > this.myObstacles[i].x && !this.passedObstacles.includes(this.myObstacles[i])) {
          this.passedObstacles.push(this.myObstacles[i]);
          this.scoreValue += .5; // Two bars are passed at the same time
        }

        this.myObstacles[i].update();
    }

    this.myGamePiece.speedY = 0;

    //
    // Change game piece Y movement based on arrow keys
    //
    if (this.gameMode === this.GameModes.BlockFlappy) {
        if (this.clicked) {
          this.gravity = -3;
          this.myGamePiece.speedY = this.gravity;
          this.clicked = false;
        } else {
          this.myGamePiece.speedY = this.gravity; // Apply Gravity
          this.gravity = this.gravity + ((this.gravity < 0) ? this.gravitySpeed * 1.5 : this.gravitySpeed); // Add to Gravity Pull Effect
        }
    } else {
        if (this.myGameArea.key && this.myGameArea.key === this.GameKeys.UP) {
          this.myGamePiece.speedY = this.blockUpKey;
        } else if (this.myGameArea.key && this.myGameArea.key === this.GameKeys.DOWN) {
          this.myGamePiece.speedY = this.blockDownKey;
        }
    }

    //
    // Display Current score
    //
    this.myScore.text = 'SCORE: ' + this.scoreValue;
    this.myScore.update();

    this.myGamePiece.newPos(); // Update New Position
    this.myGamePiece.update(); // Update Game
  }

  canvasClicked() {
    this.clicked = true;
  }

  ngOnInit() {
    this.GameModes = Object.freeze({
      BlockEasy: 'BlockEasy',
      BlockHard: 'BlockHard',
      BlockImpossible: 'BlockImpossible',
      BlockFlappy: 'BlockFlappy'
    });
    this.GameKeys = Object.freeze({UP: 'ArrowUp', DOWN: 'ArrowDown', SPACE: ' '});
    this.CanvasWidth = 720;
    this.CanvasHeight = 405;

    //
    // Game variables
    //
    this.myObstacles = [];
    this.scoreValue = 0;
    this.passedObstacles = [];
    this.gameMode = this.GameModes.BlockEasy;
    this.clicked = false;
    this.playing = false;
    this.gameEnd = false;

    //
    // Default Settings
    //
    this.barMaxHeight = 300;
    this.barMinHeight = 30;
    this.barMaxGap = 140;
    this.barMinGap = 140;

    this.updateGameInterval = 10; // Milliseconds
    this.addObstacleInterval = 100; // Milliseconds

    this.barMovementSpeed = -3;

    this.blockUpKey = -3;
    this.blockDownKey = 3;

    this.spacePress = -10;
    this.clickCanvas = -50;
    this.gravity = .5;
    this.gravitySpeed = .1;

    this.updateGameMethod = this.updateGameArea.bind(this);
    this.createGameAreaMethod = this.createGameArea.bind(this);
    this.createGameArea(this.updateGameMethod, this.updateGameInterval);
  }

}
