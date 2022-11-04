import Human from "./human.js";

let player = new Human(0, 0);
let FOOD_GROWTH_RATE = 0;
let FOOD_DECAY_RATE = 0;
let VISUAL_RANGE = 0;
let DIFFICULTY = 0.05;

// For testing purposes
class simView {
  constructor() {
    this.nodemap = new NodeMap();
  }

  test() {
    setInterval(() => {
      this.movePlayer(0, 0);
    }, 250); // Move player every 250ms
  }

  movePlayer(xx, yy) {
    player.move(xx, yy);
    this.nodemap.runUpdate(); // Update the map
  }
}

export class MapController {
  constructor(visualRange, foodGrowthRate, foodDecayRate, difficulty) {
    this.nodemap = new NodeMap();
    FOOD_GROWTH_RATE = foodGrowthRate;
    FOOD_DECAY_RATE = foodDecayRate;
    VISUAL_RANGE = visualRange;
    DIFFICULTY = difficulty;
  }

  move(x, y) {
    player.move(x, y);
    return this.nodemap.runUpdate();
  }

  update() {
    this.nodemap.runUpdate();
  }

  // Get view of map
  getView() {
    return this.nodemap.getVision();
  }

  //
}

// Data structure for an array of all stored nodes
class NodeMap {
  constructor() {
    this.index = [];
    this.map = document.getElementById("sim");
    this.runUpdate();
  }

  runUpdate() {
    let newIndex = this.generateNodeMap();
    this.mergeNodeMap(newIndex);
    return this.paintEnabledNodes();
  }

  generateNodeMap() {
    let xCount = player.getX();
    let yCount = player.getY();
    let newMap = [];

    for (let i = player.getY(); i < player.getY() + 15; i++) {
      for (let j = player.getX(); j < player.getX() + 15; j++) {
        let node = new NodeIndex(xCount, yCount);
        newMap.push(node);
        xCount++;
      }
      xCount = player.getX();
      yCount++;
    }
    return newMap;
  }

  mergeNodeMap(newMap) {
    for (let i = 0; i < newMap.length; i++) {
      if (!this.itemExists(newMap[i].x, newMap[i].y)) {
        this.index.push(newMap[i]);
      }
    }
  }

  // Adds enabled nodes to the html file and remove disabled nodes
  paintEnabledNodes() {
    let testVal;
    let retVal = "pink";

    let startX = player.getX();
    let startY = player.getY();
    let nextMap = [];
    this.index.sort((a, b) => {
      if (a.y === b.y) return a.x - b.x;
      return a.y - b.y;
    });
    for (let i = 0; i < this.index.length; i++) {
      testVal = this.index[i].updateActive();
      if (testVal !== "pink") {
        retVal = testVal;
      }
      if (
        !this.index[i].active &&
        this.map.contains(this.index[i].node.element)
      ) {
        this.map.removeChild(this.index[i].node.element);
      } else if (this.index[i].active) {
        this.map.appendChild(this.index[i].node.element);
      }
    }
    if (retVal === "pink") {
      return "pink";
    }
    return retVal;
  }

  // Checks if item exists in index
  itemExists(xCount, yCount) {
    for (let i = 0; i < this.index.length; i++) {
      if (this.index[i].x === xCount && this.index[i].y === yCount) {
        return true;
      }
    }
    return false;
  }

  getVision() {
    let playerX = player.getX() + 7;
    let lBound = playerX - VISUAL_RANGE;
    let rBound = playerX + VISUAL_RANGE;
    let playerY = player.getY() + 7;
    let uBound = playerY - VISUAL_RANGE;
    let dBound = playerY + VISUAL_RANGE;
    let retval = [];

    for (let i = 0; i < this.index.length; i++) {
      if (
        this.index[i].x >= lBound &&
        this.index[i].x <= rBound &&
        this.index[i].y >= uBound &&
        this.index[i].y <= dBound
      ) {
        retval.push(this.index[i]);
      }
    }
    if (retval.length !== 25) {
      console.log("Error: Vision array is not 25");
    }
    return retval;
  }
}

// Data structure for a single node
class NodeIndex {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.active = false;
    this.node = new Node(x, y);
  }

  updateActive() {
    let retval = "pink";
    // Check if node is player
    if (this.nodeIsPlayer()) {
      // If node is player, paint it red
      if (this.node.getPaint() === "green") {
        retval = "green";
      }
      else if(this.node.getPaint() === "yellow") {
        retval = "yellow";
      }
      this.node.paint("red");
    } else if (this.node.getPaint() === "red") {
      // If it was red, paint it white
      this.node.basePaint();
    } else if (Math.random() < FOOD_GROWTH_RATE) {
      // Growth rate
      this.node.paint("green");
    } else if (
      Math.random() < FOOD_DECAY_RATE &&
      this.node.getPaint() === "green"
    ) {
      // Decay rate
      this.node.paint("white");
    }
    let lowerBoundX = player.getX();
    let lowerBoundY = player.getY();
    let upperBoundX = player.getX() + 14;
    let upperBoundY = player.getY() + 14;

    this.active =
      lowerBoundX <= this.x &&
      this.x <= upperBoundX &&
      lowerBoundY <= this.y &&
      this.y <= upperBoundY;
    return retval;
  }

  // Returns true if node is player, ie in the center of the screen
  nodeIsPlayer() {
    return this.x === 7 + player.getX() && this.y === 7 + player.getY();
  }
}

// Data structure with node and creation data
class Node {
  constructor(x, y) {
    this.element = document.createElement("div");
    this.element.style.width = "50px";
    this.element.style.height = "50px";
    this.element.style.boxShadow = "inset 0 0 0 2px black";
    this.element.style.float = "left";

    if (Math.random() < DIFFICULTY) {
      let terrainDifficulty = Math.round((Math.random()*255)).toString(16);
      this.element.style.backgroundColor = "#" + terrainDifficulty + terrainDifficulty + terrainDifficulty;
    } else {
      this.element.style.backgroundColor = "white";
    }
    if(this.element.style.backgroundColor === "red") {
      this.player = true;
    }
    else {
      false;
    }
    this.x = x;
    this.y = y;

    this.baseColor = this.element.style.backgroundColor;

    if (Math.random() < 0.1) {
      // 10% chance of node being green
      this.element.style.backgroundColor = "#" + "00" + "80" + "00"; // TODO scale score and change color. Color currently set to be the equivalent of "green"
      if (Math.random() < 0.1) {
        this.element.style.backgroundColor = "yellow";
      }
    }
  }

  paint(color) {
    this.element.style.backgroundColor = color;
  }

  getPaint() {
    return this.element.style.backgroundColor;
  }

  basePaint() {
    this.element.style.backgroundColor = this.baseColor;
  }

  getx() {
    return this.x;
  }

  setx(value) {
    this.x = value;
  }

  gety() {
    return this.y;
  }

  sety(value) {
    this.y = value;
  }
}
