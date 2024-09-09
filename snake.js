const canvasDimensions = {
  width: 900,
  height: 600,
};

const blocksize = 30;
const refreshDelay = 100;

let ctx;

const snakey = new Snake(
  [
    [6, 4],
    [5, 4],
    [4, 4],
  ],
  "right"
);

var directionKeyCodes = {
  ArrowLeft: "left",
  ArrowUp: "up",
  ArrowRight: "right",
  ArrowDown: "down",
};

let isRunning = true;

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

function init() {
  var canvas = createCanvas();
  appendCanvasToContainer(canvas);
  ctx = canvas.getContext("2d");
  refreshcanvas();
}

function refreshcanvas() {
  if (isRunning) {
    ctx.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);
    snakey.advance();
    snakey.draw();
  }
  setTimeout(refreshcanvas, refreshDelay);
}

function Snake(body, direction) {
  this.body = body;
  this.direction = direction;
  this.draw = function () {
    ctx.save();
    ctx.fillStyle = "#ff0000";
    for (var i = 0; i < this.body.length; i++) {
      drawblock(ctx, this.body[i]);
    }
    ctx.restore();
  };

  this.advance = function () {
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
  };

  this.setdirection = function (newdirection) {
    var alloweddirections = Object.values(directionKeyCodes);
    if (!alloweddirections.includes(newdirection)) {
      throw "invalid direction";
    } else {
      this.direction = newdirection;
    }
  };
}

function drawblock(ctx, position) {
  var x = position[0] * blocksize;
  var y = position[1] * blocksize;
  ctx.fillRect(x, y, blocksize, blocksize);
}

document.onkeydown = function handlekeydown(e) {
  var keyCodePressed = e.code;
  const allowedKeyCodes = Object.keys(directionKeyCodes);
  if (!allowedKeyCodes.includes(keyCodePressed)) {
    console.log(keyCodePressed);

    if (keyCodePressed === "Space") {
      isRunning = !isRunning;
    }

    return;
  }
  snakey.setdirection(directionKeyCodes[keyCodePressed]);
};

window.onload = function () {
  init();
};
