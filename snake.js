const canvasDimensions = {
  width: 900,
  height: 600,
};

const blocksize = 30;
const refreshDelay = 100;

const playableArea = {
  width: canvasDimensions.width / blocksize,
  height: canvasDimensions.height / blocksize,
};

const snakeInitialValues = {
  body: [
    [6, 4],
    [5, 4],
    [4, 4],
  ],
  direction: "right",
  color: "#00ff00",
};

const foodColor = "#ff0000";

let score = 0;
let highscore = 0;

let ctx;
const highscoreLocalStorageKey = "highscore";

class Snake {
  constructor(body, direction, color) {
    this.body = body;
    this.direction = direction;
    this.color = color;
  }

  draw() {
    ctx.save();
    ctx.fillStyle = snakey.color;
    for (var i = 0; i < this.body.length; i++) {
      drawblock(ctx, this.body[i]);
    }
    ctx.restore();
  }

  advance() {
    var nextposition = this.body[0].slice();
    switch (this.direction) {
      case "left":
        nextposition[0] -= 1;
        break;
      case "right":
        nextposition[0] += 1;
        break;
      case "up":
        nextposition[1] -= 1;
        break;
      case "down":
        nextposition[1] += 1;
        break;
      default:
        throw "invalid direction";
    }
    this.body.unshift(nextposition);
    this.body.pop();
  }

  setdirection(newdirection) {
    if (this.direction === "up" && newdirection === "down") {
      return;
    }

    if (this.direction === "down" && newdirection === "up") {
      return;
    }

    if (this.direction === "left" && newdirection === "right") {
      return;
    }

    if (this.direction === "right" && newdirection === "left") {
      return;
    }

    this.direction = newdirection;
  }
}

let snakey = createSnake();
let foodPosition = generateRandomPosition();

var directionKeyCodes = {
  ArrowLeft: "left",
  ArrowUp: "up",
  ArrowRight: "right",
  ArrowDown: "down",
};

let isRunning = false;
let gameState;

let overlayElt;
let overlayTitleElt;
let overlayStartBtnElt;
let overlayReStartBtnElt;
let overlayScoreElt;
let overlayHighscoreElt;
let overlayPressEnterTextElt;

let highscoreElt;
let scoreElts = [];

function refreshcanvas() {
  if (isRunning) {
    snakey.advance();

    if (isSnakeEatingItself() || snakeIsOutsidePlayableArea()) {
      gameOver();
    } else {
      ctx.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);
      snakey.draw();
      if (isFoodEaten()) {
        snakey.body.push([]);
        foodPosition = generateRandomPosition();
        increaseScore();
      }
      drawFood();
    }
  }
  setTimeout(refreshcanvas, refreshDelay);
}

function drawblock(ctx, position) {
  var x = position[0] * blocksize;
  var y = position[1] * blocksize;
  ctx.fillRect(x, y, blocksize, blocksize);
  ctx.strokeRect(x, y, blocksize, blocksize);
}

document.onkeydown = function handlekeydown(e) {
  var keyCodePressed = e.code;
  const allowedKeyCodes = Object.keys(directionKeyCodes);
  if (!allowedKeyCodes.includes(keyCodePressed)) {
    console.log(keyCodePressed);
    if (keyCodePressed === "Space") {
      togglePauseGame();
    }
    if (keyCodePressed === "Enter") {
      if (gameState === "over") {
        restartGame();
        return;
      }
      startOrResumeGame();
    }
    return;
  }
  snakey.setdirection(directionKeyCodes[keyCodePressed]);
};

function startOrResumeGame() {
  isRunning = true;
  gameState = "running";
  overlayElt.classList.add("hidden");
}

function togglePauseGame() {
  if (gameState === "over") {
    return;
  }

  if (gameState === "paused") {
    startOrResumeGame();
    return;
  }

  isRunning = false;
  gameState = "paused";
  overlayElt.classList.remove("hidden");
  overlayTitleElt.innerText = "Game Paused";
  overlayStartBtnElt.innerText = "Resume";
  overlayReStartBtnElt.classList.remove("hidden");
  overlayScoreElt.classList.add("hidden");
  overlayPressEnterTextElt.classList.add("hidden");
}

function restartGame() {
  snakey = createSnake();
  overlayStartBtnElt.classList.remove("hidden");
  startOrResumeGame();
}

function gameOver() {
  isRunning = false;
  gameState = "over";

  if (isHighScore()) {
    overlayHighscoreElt.classList.remove("hidden");
    setHighScore();
  } else {
    overlayHighscoreElt.classList.add("hidden");
  }

  overlayElt.classList.remove("hidden");
  overlayTitleElt.innerText = "Game Over";
  overlayStartBtnElt.classList.add("hidden");
  overlayReStartBtnElt.classList.remove("hidden");
  overlayScoreElt.classList.remove("hidden");
  overlayPressEnterTextElt.classList.remove("hidden");
}

function createSnake() {
  return new Snake(
    [...snakeInitialValues.body],
    snakeInitialValues.direction,
    snakeInitialValues.color
  );
}

function createCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = canvasDimensions.width;
  canvas.height = canvasDimensions.height;
  canvas.style.border = "1px solid";
  return canvas;
}

function appendCanvasToContainer(canvas) {
  const containerElt = document.getElementById("container");
  containerElt.appendChild(canvas);
}

function initHTMLElements() {
  overlayElt = document.getElementById("overlay");
  overlayTitleElt = document.getElementById("overlay-title");
  overlayStartBtnElt = document.getElementById("overlay-start-button");
  overlayReStartBtnElt = document.getElementById("overlay-restart-button");
  overlayScoreElt = document.getElementById("overlay-score");
  overlayHighscoreElt = document.getElementById("overlay-highscore");
  overlayPressEnterTextElt = document.getElementById("overlay-press-enter-text");

  scoreElts = document.getElementsByClassName("score");
  highscoreElt = document.getElementById("highscore");
}

function init() {
  initHTMLElements();

  loadHighscore();

  initCanvas();

  refreshcanvas();
}

function initCanvas() {
  var canvas = createCanvas();
  appendCanvasToContainer(canvas);
  ctx = canvas.getContext("2d");
}

function loadHighscore() {
  const highscoreStr = localStorage.getItem(highscoreLocalStorageKey);
  if (highscoreStr) {
    highscore = parseInt(highscoreStr);
  } else {
    highscore = 0;
  }
  highscoreElt.innerText = highscore;
}

function drawFood() {
  ctx.save();
  ctx.fillStyle = foodColor;
  drawblock(ctx, foodPosition);
  ctx.restore();
}

function isFoodEaten() {
  const snakeHead = snakey.body[0];
  return snakeHead[0] === foodPosition[0] && snakeHead[1] === foodPosition[1];
}

function snakeIsOutsidePlayableArea() {
  const snakeHead = snakey.body[0];
  return (
    snakeHead[0] < 0 ||
    snakeHead[0] >= playableArea.width ||
    snakeHead[1] < 0 ||
    snakeHead[1] >= playableArea.height
  );
}

function isSnakeEatingItself() {
  const snakeHead = snakey.body[0];
  for (var i = 1; i < snakey.body.length; i++) {
    if (
      snakeHead[0] === snakey.body[i][0] &&
      snakeHead[1] === snakey.body[i][1]
    ) {
      return true;
    }
  }
  return false;
}

function increaseScore() {
  score += 1;
  for (var i = 0; i < scoreElts.length; i++) {
    scoreElts[i].innerText = score;
  }
}

function isHighScore() {
  return score > highscore;
}

function setHighScore() {
  highscore = score;
  highscoreElt.innerText = highscore;
  localStorage.setItem(highscoreLocalStorageKey, highscore);
}

function generateRandomPosition() {
  const position = [
    Math.floor(Math.random() * playableArea.width),
    Math.floor(Math.random() * playableArea.height),
  ];

  for (var i = 0; i < snakey.body.length; i++) {
    if (
      snakey.body[i][0] === position[0] &&
      snakey.body[i][1] === position[1]
    ) {
      return generateRandomPosition();
    }
  }
  return position;
}

window.onload = function () {
  init();
};
