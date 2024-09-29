const DIRECTION_UP = 0;
const DIRECTION_RIGHT = 1;
const DIRECTION_DOWN = 2;
const DIRECTION_LEFT = 3;

class Snake {
  constructor() {
    this.size = 10;
    this.speed = 200; // in ms
    this.playing = false;
    this.alive = true;

    this.snakeBody;
    this.snakeDirection;
    this.apple;

    this.changeDirection = this.changeDirection.bind(this);
    this.startNewGame = this.startNewGame.bind(this);
  }

  init() {
    this.app = document.body;
    this.drawUI();
    document.addEventListener('keydown', this.changeDirection);
    setInterval(this.tick.bind(this), this.speed)
  }

  drawUI() {
    this.app.textContent = "";
    let grid = document.createElement("div")
    grid.id = "grid";
    grid.style = `grid-template-columns: repeat(${this.size}, 1fr)`;

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let cell = document.createElement("div");
        cell.id = this.id(x, y);
        grid.appendChild(cell);
      }
    }

    this.state = document.createElement("div");
    this.state.id = "state"
    this.state.textContent = "GAME OVER"

    this.controls = document.createElement("div");
    this.controls.id = "controls"
    let button = document.createElement("button");
    button.innerHTML = "Neues Spiel starten"
    button.addEventListener("click", () => {
      this.startNewGame();
    })
    this.controls.appendChild(button);

    this.app.appendChild(this.state);
    this.app.appendChild(grid);
    this.app.appendChild(this.controls);
  }

  resetSnake() {
    let center = Math.ceil(this.size / 2) - 1;
    this.snakeBody = [];

    for (let i = 0; i < this.snakeLengthAtStart(); i++) {
      this.snakeBody.push([center + i, center])
    }

    this.snakeDirection = DIRECTION_LEFT;
  }

  snakeLengthAtStart() {
    return Math.floor(this.size / 3)
  }

  startNewGame() {
    this.resetSnake();
    this.placeNewApple();
    this.alive = true;
    this.playing = true;
    this.controls.style.visibility = "hidden";
  }

  tick() {
    if (this.playing && this.alive) {
      this.moveSnake();
      this.updateGrid();
      this.checkGameOver();
    }
  }

  moveSnake() {
    let snakeHead = this.snakeBody[0]

    let newHead;

    switch (this.snakeDirection) {
      case DIRECTION_UP:
        newHead = [snakeHead[0], (snakeHead[1] + this.size - 1) % this.size]
        break;
      case DIRECTION_RIGHT:
        newHead = [(snakeHead[0] + 1) % this.size, snakeHead[1]]
        break;
      case DIRECTION_DOWN:
        newHead = [snakeHead[0], (snakeHead[1] + 1) % this.size]
        break;
      case DIRECTION_LEFT:
        newHead = [(snakeHead[0] + this.size - 1) % this.size, snakeHead[1]]
        break;
    }
    if (this.snakeBody.map((e) => JSON.stringify(e)).includes(JSON.stringify(newHead))) {
      this.alive = false;
    }

    if (JSON.stringify(snakeHead) == JSON.stringify(this.apple))
      this.placeNewApple();
    else
      this.snakeBody.pop();

    this.snakeBody = [newHead, ...this.snakeBody];
  }

  updateGrid() {
    document.querySelectorAll("#grid>*").forEach((e) => e.style = "");

    let appleColor = this.alive ? "red" : "black";
    let snakeColor = this.alive ? "green" : "black";

    this.elementAt(this.apple).style = `background-color: ${appleColor};`;
    this.snakeBody.forEach((el) => this.elementAt(el).style = `background-color: ${snakeColor};`)
  }

  checkGameOver() {
    if (!this.alive) {
      let eaten = this.snakeBody.length - this.snakeLengthAtStart();
      this.state.textContent = `GAME OVER! Du hast ${eaten} Äpfel gegessen.`;
      this.state.style.visibility = "initial";
      this.controls.style.visibility = "initial";
    }
  }

  placeNewApple() {
    do {
      this.apple = [Math.floor(Math.random() * this.size), Math.floor(Math.random() * this.size)]
    } while (this.snakeBody.map((e) => JSON.stringify(e)).includes(JSON.stringify(this.apple)));
  }


  changeDirection(event) {
    if (["ArrowLeft", "a"].includes(event.key)) this.snakeDirection = (this.snakeDirection + 3) % 4
    if (["ArrowRight", "d"].includes(event.key)) this.snakeDirection = (this.snakeDirection + 1) % 4
  }

  elementAt(point) {
    return document.getElementById(this.id(point[0], point[1]))
  }

  id(x, y) {
    return `x${x}y${y}`
  }
}

new Snake().init();