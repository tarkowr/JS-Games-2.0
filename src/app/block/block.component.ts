import { Component, OnInit } from '@angular/core';
import { LocalStorage } from '../services/localStorage.service';
import { GameService } from '../services/game.service';

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
  clickerUpper: boolean;
  playing: boolean;
  gameEnd: boolean;

  barMaxHeight: number;
  barMinHeight: number;
  barGap: number;
  barGapRange: number; //Larger number will create smaller spread

  updateGameInterval: number; // Milliseconds
  addObstacleInterval: number; // Milliseconds

  barMovementSpeed: number;

  blockUpKey: number;
  blockDownKey: number;

  clickCanvas: number;
  gravity: number;
  gravitySpeed: number;

  myGameArea: any;

  updateGameMethod: any;
  createGameAreaMethod: any;

  localStorage: LocalStorage;

  mobile: Boolean = false;
  breakpoint = 992;
  caption: string;

  constructor(private gameService: GameService) {
    this.localStorage = new LocalStorage();
  }

  //
  // Setup game variables and high score
  //
  SetupGame(mode) {
    this.gameMode = mode;
    this.GameSettings(mode);
    this.SetCaption();
    this.startGame();
  }

  SetCaption() {
    if (this.mobile || this.gameMode == this.GameModes.BlockFlappy) {
      this.caption = 'Tap the screen the move the block';
    }
    else {
      this.caption = 'Use the arrow keys to move the block'
    }
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
  GameDifficultyEasy() { }

  //
  // Settings for Game Difficulty Hard
  //
  GameDifficultyHard() {
    this.barGap = 110;

    if (!this.mobile) {
      this.addObstacleInterval = 40; // Milliseconds
      this.barMovementSpeed = -8;
      this.blockUpKey = -8;
      this.blockDownKey = 8;
    }
  }

  //
  // Settings for Game Difficulty Impossible
  //
  GameDifficultyImpossible() {
    this.barGap = 110;
    this.addObstacleInterval = 35;

    if (!this.mobile) {
      this.addObstacleInterval = 30; // Milliseconds
      this.barMovementSpeed = -10;
      this.blockUpKey = -10;
      this.blockDownKey = 10;
    }
  }

  //
  // Settings for Game Difficulty Flappy
  //
  GameDifficultyFlappy() {
    this.barGap = 160;
  }

  //
  // Execute to Start Game
  //
  startGame() {
    this.myGamePiece = this.component(45, 45, '#f43030', 75, 180, 'piece'); // Instantiate new Game Component -- 30,30
    this.myScore = this.component('30px', 'Consolas', 'black', this.CanvasWidth - 160, 40, 'text');
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

    this.setCanvasSize();
    this.GameSettings(this.gameMode);
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
    for (let i = 0; i < this.myObstacles.length; i++) {
        if (this.myGamePiece.crashWith(this.myObstacles[i])) {
            this.myGameArea.stop();

            let id = this.localStorage.GetUser()

            if (id){
              this.gameService.blockResults(id, this.gameMode, this.scoreValue)
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
    if (this.everyinterval(this.addObstacleInterval)) {
        x = this.myGameArea.canvas.width;
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

        this.myObstacles.push(this.component(width, heightUpper, color, x, yUpper, 'obstacle')); // top
        this.myObstacles.push(this.component(width, heightLower, color, x, yLower, 'obstacle')); // bottom
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
          this.scoreValue = this.passedObstacles.length / 2; // Two bars are passed at the same time
        }

        this.myObstacles[i].update();
    }

    // Remove older obstacles
    if (this.myObstacles.length > 10) {
      this.myObstacles.splice(0, 6);
    }

    this.myGamePiece.speedY = 0;

    //
    // Change game piece Y movement based on arrow keys
    //
    if (this.gameMode === this.GameModes.BlockFlappy) {
        if (this.clicked) {
          this.gravity = -6;
          this.myGamePiece.speedY = this.gravity;
          this.clicked = false;
        } else {
          this.myGamePiece.speedY = this.gravity; // Apply Gravity
          this.gravity = this.gravity + ((this.gravity < 0) ? this.gravitySpeed * 2 : this.gravitySpeed); // Add to Gravity Pull Effect
        }
    } else {
        if (!this.mobile) {
          if (this.myGameArea.key && this.myGameArea.key === this.GameKeys.UP) {
            this.myGamePiece.speedY = this.blockUpKey;
          } else if (this.myGameArea.key && this.myGameArea.key === this.GameKeys.DOWN) {
            this.myGamePiece.speedY = this.blockDownKey;
          }
        } 
        else {
          if (this.clicked) {
            const yOffset = 40;

            if (this.clickerUpper) {
              this.myGamePiece.speedY = yOffset;
            } else {
              this.myGamePiece.speedY = -yOffset;
            }

            this.clicked = false;
          }
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

  //
  // Handle canvas click
  //
  canvasClicked(e) {
    if ((e.layerY / this.CanvasHeight) > 0.5) this.clickerUpper = true;
    else this.clickerUpper = false;

    this.clicked = true;
  }

  //
  // Set the canvas size
  //
  setCanvasSize(){
    if(window.innerWidth < this.breakpoint) this.mobile = true;
    else this.mobile = false;

    if (!this.mobile){
      this.CanvasWidth = 720;
    }
    else {
      this.CanvasWidth = window.innerWidth - 20;
    }

    this.CanvasHeight = 400;
  }

  //
  // Initialize variables with default values
  //
  setDefaults() {
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
    this.barGap = 140;
    this.barGapRange = 30
    this.barMaxHeight = this.CanvasHeight - this.barGap - this.barGapRange;
    this.barMinHeight = this.barGapRange;

    this.updateGameInterval = 20; // Milliseconds
    this.addObstacleInterval = 50; // Milliseconds

    this.barMovementSpeed = -6;

    this.blockUpKey = -6;
    this.blockDownKey = 6;

    this.clickCanvas = -50;
    this.gravity = 0;
    this.gravitySpeed = .24;
  }

  ngOnInit() {
    this.GameModes = Object.freeze({
      BlockEasy: 'easy',
      BlockHard: 'hard',
      BlockImpossible: 'impossible',
      BlockFlappy: 'flappy'
    });
    this.GameKeys = Object.freeze({UP: 'ArrowUp', DOWN: 'ArrowDown', SPACE: ' '});

    this.setCanvasSize()
    this.setDefaults();

    this.updateGameMethod = this.updateGameArea.bind(this);
    this.createGameAreaMethod = this.createGameArea.bind(this);
    this.createGameArea(this.updateGameMethod, this.updateGameInterval);
  }

}
