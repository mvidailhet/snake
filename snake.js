window.onload = function () {
  var canvaswidth = 900;
  var canvasheight = 600;
  var blocksize = 30;
  var ctx;
  var delay = 100;
  var snakey;

  var isRunning = true;

  init();

  function init() {
    var canvas = document.createElement("canvas");
    canvas.width = canvaswidth;
    canvas.height = canvasheight;
    canvas.style.border = "1px solid";
    var containerElt = document.getElementById("container");
    containerElt.appendChild(canvas);
    ctx = canvas.getContext("2d");
    snakey = new Snake(
      [
        [6, 4],
        [5, 4],
        [4, 4],
      ],
      "right"
    );
    refreshcanvas();
  }

  function refreshcanvas() {
    if (isRunning) {
      ctx.clearRect(0, 0, canvaswidth, canvasheight);
      snakey.advance();
      snakey.draw();
    }
    setTimeout(refreshcanvas, delay);
  }

  function drawblock(ctx, position) {
    var x = position[0] * blocksize;
    var y = position[1] * blocksize;
    ctx.fillRect(x, y, blocksize, blocksize);
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

  var directionKeyCodes = {
    ArrowLeft: "left",
    ArrowUp: "up",
    ArrowRight: "right",
    ArrowDown: "down",
  };

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
};
