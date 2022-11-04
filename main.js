import { MapController } from "./nodeMap.js";

class Game {
  constructor() {
    this.mapController = new MapController(2, 0.0005, 0.01);
    this.scoreBoard = document.getElementById("score");
    this.restartButton = document.getElementById("restartButton");
    this.restartButton.onclick = () => {
      location.reload();
    };
    this.score = 0;
  }

  draw() {
    this.mapController.update();

    this.scoreBoard.innerHTML = "Score is " + this.score;
  }

  move(x, y) {
    let collected = this.mapController.move(x, y);
    if (collected === "green") {
      this.score += 1;
    }
    this.draw();
  }
}

let game = new Game();
loop();

let state = {
  actionPerformed: true,
  pressedKeys: {
    left: false,
    right: false,
    up: false,
    down: false,
  },
};

const keyMap = {
  39: "right",
  37: "left",
  40: "up",
  38: "down",
};

function keydown(event) {
  let key = keyMap[event.keyCode];
  state.pressedKeys[key] = true;
  state.actionPerformed = false;
}

function keyup(event) {
  let key = keyMap[event.keyCode];
  state.pressedKeys[key] = false;
}

window.addEventListener("keydown", keydown, false);
window.addEventListener("keyup", keyup, false);

function update() {
  if (!state.actionPerformed) {
    let x = 0;
    let y = 0;
    if (state.pressedKeys.left) {
      x = -1;
    } else if (state.pressedKeys.right) {
      x = 1;
    } else if (state.pressedKeys.up) {
      y = 1;
    } else if (state.pressedKeys.down) {
      y = -1;
    }
    game.move(x, y);
    state.actionPerformed = true;
  }
}

function loop(timestamp) {
  // Update every 100ms
  game.draw();
  setInterval(() => {
    update();
  }, 10);
  setInterval(() => {
    game.move(
      Math.round(Math.random() * 2 - 1),
      Math.round(Math.random() * 2 - 1)
    );
  }, 100);
}
